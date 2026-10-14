// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import {ApiClient} from '../../../context/api';
import {HttpError, RunError} from '../../../errors';

type Seen = {
  method?: string;
  url?: string;
  authorization?: string;
  contentType?: string;
  body: string;
  headers?: http.IncomingHttpHeaders;
};

describe('ApiClient', () => {
  let server: http.Server;
  let baseUrl: string;
  let seen: Seen;
  let requestCount = 0;
  let reply: (res: http.ServerResponse) => void;

  before(async () => {
    server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        requestCount += 1;
        seen = {
          method: req.method,
          url: req.url,
          authorization: req.headers.authorization,
          contentType: req.headers['content-type'],
          body,
          headers: req.headers,
        };
        reply(res);
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(
    () =>
      new Promise<void>(resolve => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  );

  const api = () => new ApiClient(baseUrl, {token: 'tok'});

  it('sends the token and a JSON body, and returns the JSON answer', async () => {
    reply = res =>
      res
        .writeHead(200, {'content-type': 'application/json'})
        .end('{"id":"d1"}');

    const created = await api().post<{id: string}>('/orders', {name: 'x'});

    expect(created).to.deepEqual({id: 'd1'});
    expect(seen).to.containEql({
      method: 'POST',
      url: '/orders',
      authorization: 'Bearer tok',
      contentType: 'application/json',
      body: '{"name":"x"}',
    });
  });

  for (const method of ['put', 'patch'] as const) {
    it(`sends a ${method.toUpperCase()} with a JSON body, and returns the JSON answer`, async () => {
      reply = res =>
        res
          .writeHead(200, {'content-type': 'application/json'})
          .end('{"id":"d2","state":"done"}');

      const updated = await api()[method]<{id: string}>('/orders/d2', {
        state: 'done',
      });

      expect(updated).to.deepEqual({id: 'd2', state: 'done'});
      expect(seen).to.containEql({
        method: method.toUpperCase(),
        url: '/orders/d2',
        authorization: 'Bearer tok',
        contentType: 'application/json',
        body: '{"state":"done"}',
      });
    });
  }

  it('sends no body and no content type with a GET', async () => {
    reply = res => res.writeHead(200).end('[]');

    await api().get('/orders?limit=1');

    expect(seen).to.containEql({
      method: 'GET',
      url: '/orders?limit=1',
      body: '',
    });
    expect(seen.contentType).to.be.undefined();
  });

  it('gives undefined for a response with no body', async () => {
    reply = res => res.writeHead(204).end();

    expect(await api().delete('/orders/1')).to.be.undefined();
    expect(seen.method).to.equal('DELETE');
  });

  it('names the request when a body is not JSON', async () => {
    reply = res => res.writeHead(200).end('<html>login</html>');

    await expect(api().get('/orders')).to.be.rejectedWith(
      'GET /orders gave 200 with a body that is not JSON: <html>login</html>. To read such a body, use ctx.api.raw().',
    );
  });

  it('throws with the method, the path, the status and the body for an error status', async () => {
    reply = res => res.writeHead(400).end('Overlapping order item!');

    await expect(api().post('/order-items', {})).to.be.rejectedWith(
      'POST /order-items gave 400: Overlapping order item!',
    );
  });

  it('keeps the status of an error response, so that a caller can tell a 404', async () => {
    reply = res => res.writeHead(404).end('gone');

    const failure = await api()
      .delete('/orders/1')
      .then(
        () => undefined,
        (err: unknown) => err,
      );

    expect(failure).to.be.instanceOf(HttpError);
    expect(failure).to.containEql({
      method: 'DELETE',
      path: '/orders/1',
      status: 404,
      body: 'gone',
    });
  });

  it('stops an open request when the signal aborts', async () => {
    reply = () => undefined;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 50);

    await expect(
      new ApiClient(baseUrl, {
        token: 'tok',
        signal: () => controller.signal,
      }).get('/slow'),
    ).to.be.rejected();
  });

  it('refuses a request when the signal has aborted already', async () => {
    reply = res => res.writeHead(200).end('{}');
    const controller = new AbortController();
    controller.abort();
    seen = {body: 'untouched'};

    await expect(
      new ApiClient(baseUrl, {
        token: 'tok',
        signal: () => controller.signal,
      }).get('/never'),
    ).to.be.rejected();
    expect(seen.body).to.equal('untouched');
  });

  it('asks for the signal at each request, so the owner can stop using it', async () => {
    reply = res => res.writeHead(200).end('{}');
    const controller = new AbortController();
    controller.abort();
    let current: AbortSignal | undefined = controller.signal;
    const client = new ApiClient(baseUrl, {
      token: 'tok',
      signal: () => current,
    });

    await expect(client.get('/refused')).to.be.rejected();
    current = undefined;

    await expect(client.get('/allowed')).to.be.fulfilled();
  });

  it('stops a request that takes longer than the timeout', async () => {
    reply = () => undefined;

    await expect(
      new ApiClient(baseUrl, {token: 'tok', timeoutMs: 50}).get('/slow'),
    ).to.be.rejectedWith(/timed out after/);
  });

  describe('network failures', () => {
    it('names the method, the path and the reason of a refused connection', async () => {
      const closed = http.createServer();
      await new Promise<void>(resolve =>
        closed.listen(0, '127.0.0.1', resolve),
      );
      const url = `http://127.0.0.1:${(closed.address() as AddressInfo).port}`;
      await new Promise<void>(resolve => closed.close(() => resolve()));

      const error = await new ApiClient(url)
        .get('/items', {query: {a: 1}})
        .catch((err: unknown) => err);

      expect(error).to.be.instanceOf(RunError);
      expect((error as RunError).message).to.match(
        /^GET \/items\?a=1 failed: .*ECONNREFUSED/,
      );
      expect((error as RunError).cause).to.be.instanceOf(Error);
    });

    it('says that a request timed out, and after how many seconds', async () => {
      reply = () => undefined;

      const error = await new ApiClient(baseUrl, {timeoutMs: 50})
        .get('/slow')
        .catch((err: unknown) => err);

      expect(error).to.be.instanceOf(RunError);
      expect((error as RunError).message).to.equal(
        'GET /slow timed out after 0.05 s',
      );
    });

    it('names the method and the path when the body stalls', async () => {
      reply = res => {
        res.writeHead(200, {
          'content-type': 'application/json',
          'content-length': '100',
        });
        res.write('{');
      };

      const error = await new ApiClient(baseUrl, {timeoutMs: 50})
        .get('/stall', {query: {a: 1}})
        .catch((err: unknown) => err);

      expect(error).to.be.instanceOf(RunError);
      expect((error as RunError).message).to.equal(
        'GET /stall?a=1 timed out after 0.05 s',
      );
    });

    it('throws the reason of the cancel signal as it is', async () => {
      reply = () => undefined;
      const controller = new AbortController();
      const reason = new Error('cancelled');
      setTimeout(() => controller.abort(reason), 50);

      const error = await new ApiClient(baseUrl, {
        signal: () => controller.signal,
      })
        .get('/slow')
        .catch((err: unknown) => err);

      expect(error).to.equal(reason);
    });
  });

  describe('headers', () => {
    it('adds the headers of a call, and removes one with undefined', async () => {
      reply = res => res.writeHead(200).end('{}');

      await api().get('/x', {
        headers: {'x-tenant': 't1', authorization: undefined},
      });

      expect(seen.headers?.['x-tenant']).to.equal('t1');
      expect(seen.authorization).to.be.undefined();
    });

    it('sends the headers of the client', async () => {
      reply = res => res.writeHead(200).end('{}');

      await new ApiClient(baseUrl, {headers: {'x-a': '1'}}).get('/x');

      expect(seen.headers?.['x-a']).to.equal('1');
      expect(seen.authorization).to.be.undefined();
    });
  });

  describe('query', () => {
    it('uses String(), skips undefined, and merges with the query of the path', async () => {
      reply = res => res.writeHead(200).end('{}');

      await api().get('/orders?a=1', {
        query: {n: 2, ok: false, s: 'x y', skip: undefined},
      });

      expect(seen.url).to.equal('/orders?a=1&n=2&ok=false&s=x+y');
    });

    it('starts a query when the path has none, and adds nothing for an empty one', async () => {
      reply = res => res.writeHead(200).end('{}');

      await api().get('/a', {query: {q: 1}});
      expect(seen.url).to.equal('/a?q=1');
      await api().get('/b', {query: {q: undefined}});
      expect(seen.url).to.equal('/b');
    });

    it('puts the query in the path of an HttpError', async () => {
      reply = res => res.writeHead(500).end('no');

      const err = await api()
        .get('/a', {query: {q: 1}})
        .catch((e: unknown) => e);

      expect(err).to.containEql({path: '/a?q=1'});
    });
  });

  describe('body', () => {
    beforeEach(() => {
      reply = res => res.writeHead(200).end('{}');
    });

    it('sends FormData with the content type that fetch makes', async () => {
      const form = new FormData();
      form.set('f', 'v');

      await api().post('/up', form);

      expect(seen.contentType).to.match(/^multipart\/form-data; boundary=/);
      expect(seen.body).to.match(/name="f"/);
    });

    it('sends URLSearchParams with the content type that fetch makes', async () => {
      await api().post('/up', new URLSearchParams({a: '1'}));

      expect(seen.contentType).to.match(/^application\/x-www-form-urlencoded/);
      expect(seen.body).to.equal('a=1');
    });

    it('sets no content type for a Blob or an ArrayBuffer', async () => {
      await api().post('/up', new Blob(['abc']));
      expect(seen.contentType).to.be.undefined();
      expect(seen.body).to.equal('abc');

      await api().post('/up', new TextEncoder().encode('xyz').buffer);
      expect(seen.contentType).to.be.undefined();
      expect(seen.body).to.equal('xyz');
    });

    it('sends a string as it is', async () => {
      await api().post('/up', 'a,b', {headers: {'content-type': 'text/csv'}});

      expect(seen.body).to.equal('a,b');
      expect(seen.contentType).to.equal('text/csv');
    });

    it('does not set the JSON content type for a string', async () => {
      await api().post('/up', 'plain');

      expect(seen.body).to.equal('plain');
      expect(seen.contentType).to.match(/^text\/plain/);
    });

    it('keeps a content type that the caller set for a JSON body', async () => {
      await api().post(
        '/x',
        {a: 1},
        {headers: {'content-type': 'application/vnd.api+json'}},
      );

      expect(seen.contentType).to.equal('application/vnd.api+json');
      expect(seen.body).to.equal('{"a":1}');
    });
  });

  describe('raw', () => {
    it('gives the Response on 200, also for a body that is not JSON', async () => {
      reply = res => res.writeHead(200, {'x-h': 'v'}).end('abc');

      const res = await api().raw('GET', '/file');

      expect(res.headers.get('x-h')).to.equal('v');
      expect(await res.text()).to.equal('abc');
    });

    it('throws an HttpError on 500', async () => {
      reply = res => res.writeHead(500).end('boom');

      const err = await api()
        .raw('POST', '/x', {a: 1})
        .catch((e: unknown) => e);

      expect(err).to.be.instanceOf(HttpError);
      expect(err).to.containEql({method: 'POST', status: 500, body: 'boom'});
    });
  });

  describe('with', () => {
    it('gives a new client with merged headers, and leaves the old one', async () => {
      reply = res => res.writeHead(200).end('{}');
      const base = new ApiClient(baseUrl, {
        token: 'tok',
        headers: {'x-a': '1', 'x-b': '1'},
      });

      const other = base.with({
        headers: {Authorization: 'Bearer other', 'x-b': undefined},
      });
      await other.get('/x');

      expect(seen.authorization).to.equal('Bearer other');
      expect(seen.headers?.['x-a']).to.equal('1');
      expect(seen.headers?.['x-b']).to.be.undefined();
      await base.get('/x');
      expect(seen.authorization).to.equal('Bearer tok');
      expect(seen.headers?.['x-b']).to.equal('1');
    });

    it('keeps the signal and the timeout', async () => {
      reply = () => undefined;

      await expect(
        new ApiClient(baseUrl, {timeoutMs: 50}).with({headers: {}}).get('/s'),
      ).to.be.rejectedWith(/timed out after/);
    });
  });

  describe('errors', () => {
    it('fills data for a JSON error', async () => {
      reply = res =>
        res
          .writeHead(422, {'content-type': 'application/json'})
          .end('{"code":"X"}');

      const err = (await api()
        .get('/x')
        .catch((e: unknown) => e)) as HttpError;

      expect(err.data).to.deepEqual({code: 'X'});
    });

    it('leaves data undefined for an HTML 502, and for broken JSON', async () => {
      reply = res =>
        res.writeHead(502, {'content-type': 'text/html'}).end('<html>bad');
      const html = (await api()
        .get('/x')
        .catch((e: unknown) => e)) as HttpError;
      reply = res =>
        res.writeHead(500, {'content-type': 'application/json'}).end('{oops');
      const broken = (await api()
        .get('/x')
        .catch((e: unknown) => e)) as HttpError;

      expect(html).to.be.instanceOf(HttpError);
      expect(html.data).to.be.undefined();
      expect(html.body).to.equal('<html>bad');
      expect(broken).to.be.instanceOf(HttpError);
      expect(broken.data).to.be.undefined();
    });

    it('gives undefined for an empty body', async () => {
      reply = res => res.writeHead(200).end();

      expect(await api().get('/x')).to.be.undefined();
    });

    it('throws a RunError that names raw() for a 2xx body that is not JSON', async () => {
      reply = res => res.writeHead(200).end('<html>');

      const err = await api()
        .get('/x')
        .catch((e: unknown) => e);

      expect(err).to.be.instanceOf(RunError);
      expect((err as Error).message).to.match(
        /not JSON: <html>.*ctx\.api\.raw\(\)/,
      );
    });
  });

  it('cuts a long error body in the message, and keeps all of it in body', async () => {
    const body = 'x'.repeat(500);
    reply = res => res.writeHead(500).end(body);

    const failure = (await api()
      .get('/big')
      .catch((err: unknown) => err)) as HttpError;

    expect(failure.message).to.equal(`GET /big gave 500: ${'x'.repeat(200)}`);
    expect(failure.body).to.equal(body);
  });

  it('throws an HttpError with the status and an empty body when the body cannot be read', async () => {
    reply = res => {
      res.writeHead(502, {'content-length': '100'});
      res.write('part');
      setTimeout(() => res.destroy(), 20);
    };

    const failure = await api()
      .get('/cut')
      .catch((err: unknown) => err);

    expect(failure).to.be.instanceOf(HttpError);
    expect(failure).to.containEql({status: 502, body: ''});
  });

  describe('a path that does not start with a slash', () => {
    const CALLS: [string, (path: string) => Promise<unknown>][] = [
      ['GET', path => api().get(path)],
      ['POST', path => api().post(path, {})],
      ['PUT', path => api().put(path, {})],
      ['PATCH', path => api().patch(path, {})],
      ['DELETE', path => api().delete(path)],
      ['HEAD', path => api().raw('HEAD', path)],
    ];

    for (const [method, call] of CALLS) {
      for (const path of ['@evil.test/x', 'orders', '']) {
        it(`refuses ${method} "${path}" and sends no request`, async () => {
          requestCount = 0;

          const error = await call(path).catch((err: unknown) => err);

          expect(error).to.be.instanceOf(RunError);
          expect((error as RunError).message).to.equal(
            `${method} ${path}: the path must start with "/"`,
          );
          expect(requestCount).to.equal(0);
        });
      }
    }

    it('sends "//evil.test/x" to the base URL host, as a path', async () => {
      requestCount = 0;
      reply = res =>
        res.writeHead(200, {'content-type': 'application/json'}).end('{}');

      await api().get('//evil.test/x');

      expect(requestCount).to.equal(1);
      expect(seen.url).to.equal('//evil.test/x');
    });
  });
});

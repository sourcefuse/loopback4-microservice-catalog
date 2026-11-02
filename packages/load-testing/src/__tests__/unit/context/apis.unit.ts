// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import {namedApis} from '../../../context/apis';
import {ConfigError} from '../../../errors';

describe('namedApis', () => {
  let server: http.Server;
  let url: string;

  before(async () => {
    server = http.createServer((req, res) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({path: req.url}));
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(() => server.close());

  it('gives a client for each name, which calls its URL', async () => {
    const apis = namedApis({auth: url}, {});

    expect(await apis.auth.get('/auth/me')).to.eql({path: '/auth/me'});
  });

  it('throws a ConfigError that lists the known names for an unknown name', () => {
    const apis = namedApis({auth: url, core: url}, {});

    expect(() => apis.auht).to.throw(ConfigError);
    expect(() => apis.auht).to.throw(
      "No API 'auht' in config.ts apis. Known: auth, core",
    );
  });

  it('can be awaited and written as JSON, because then and toJSON are not names', async () => {
    const apis = namedApis({auth: url}, {});

    expect((await Promise.resolve(apis)) === apis).to.be.true();
    expect(Object.keys(JSON.parse(JSON.stringify(apis)))).to.eql(['auth']);
  });

  it('says that no name is known when apis is empty', () => {
    expect(() => namedApis({}, {}).auth).to.throw(/Known: none/);
  });
});

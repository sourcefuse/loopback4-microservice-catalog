// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {
  ConfigError,
  errorMessage,
  fetchFailure,
  guardedStep,
  HttpError,
  LoadTestError,
  LoginError,
  RunError,
  ScenarioError,
} from '../../errors';

describe('error classes', () => {
  const cause = new Error('root');
  const http = new HttpError({
    method: 'GET',
    path: '/a?b=1',
    status: 502,
    statusText: 'Bad Gateway',
    headers: new Headers({'x-id': '7'}),
    body: '<html>',
    data: undefined,
  });
  const cases: Array<[string, LoadTestError]> = [
    ['ConfigError', new ConfigError('h', ['p'])],
    ['ScenarioError', new ScenarioError('h', ['p'])],
    ['HttpError', http],
    ['LoginError', new LoginError('m')],
    ['RunError', new RunError('m')],
  ];

  for (const [name, err] of cases) {
    it(`${name} is a LoadTestError and an Error, with its name`, () => {
      expect(err).to.be.instanceOf(LoadTestError);
      expect(err).to.be.instanceOf(Error);
      expect(err.name).to.equal(name);
    });
  }

  for (const Problems of [ConfigError, ScenarioError]) {
    it(`${Problems.name} writes the problems indented under the header`, () => {
      const err = new Problems('file:', ['one', 'two']);

      expect(err.message).to.equal('file:\n  one\n  two');
      expect(err.problems).to.deepEqual(['one', 'two']);
    });

    it(`${Problems.name} with no problems has only the header`, () => {
      expect(new Problems('only this').message).to.equal('only this');
    });
  }

  it('HttpError carries the response and keeps the message format', () => {
    expect(http.message).to.equal('GET /a?b=1 gave 502: <html>');
    expect(http).to.containEql({
      method: 'GET',
      path: '/a?b=1',
      status: 502,
      statusText: 'Bad Gateway',
      body: '<html>',
    });
    expect(http.headers.get('x-id')).to.equal('7');
    expect(http.data).to.be.undefined();
  });

  it('keeps the cause', () => {
    expect(new LoginError('m', {cause}).cause).to.equal(cause);
    expect(new RunError('m', {cause}).cause).to.equal(cause);
    expect(new ConfigError('h', ['p'], {cause}).cause).to.equal(cause);
    expect(new ScenarioError('h', ['p'], {cause}).cause).to.equal(cause);
  });
});

describe('errorMessage', () => {
  it('gives the message of an Error and the text of a text', () => {
    expect(errorMessage(new Error('boom'))).to.equal('boom');
    expect(errorMessage('plain text')).to.equal('plain text');
  });

  it('shows the fields of an object that is not an Error', () => {
    expect(errorMessage({code: 'E_X', status: 7})).to.equal(
      "{ code: 'E_X', status: 7 }",
    );
  });
});

describe('fetchFailure', () => {
  const TIMEOUT_MS = 5000;

  it('shows the messages of an AggregateError cause with an empty message', () => {
    const cause = new AggregateError(
      [
        new Error('connect ECONNREFUSED ::1:3000'),
        new Error('connect ECONNREFUSED 127.0.0.1:3000'),
      ],
      '',
    );

    expect(
      fetchFailure(
        'GET',
        '/x',
        new TypeError('fetch failed', {cause}),
        TIMEOUT_MS,
      ),
    ).to.equal(
      'GET /x failed: connect ECONNREFUSED ::1:3000; connect ECONNREFUSED 127.0.0.1:3000',
    );
  });

  it('shows each distinct message of the AggregateError once', () => {
    const cause = new AggregateError(
      [new Error('connect ECONNREFUSED'), new Error('connect ECONNREFUSED')],
      '',
    );

    expect(
      fetchFailure('GET', '/x', new TypeError('fetch failed', {cause}), 1),
    ).to.equal('GET /x failed: connect ECONNREFUSED');
  });

  it('shows the code when the cause has no message', () => {
    const cause = Object.assign(new Error(''), {code: 'ECONNREFUSED'});

    expect(
      fetchFailure('GET', '/x', new TypeError('fetch failed', {cause}), 1),
    ).to.equal('GET /x failed: ECONNREFUSED');
  });

  it('shows the message of a normal cause', () => {
    expect(
      fetchFailure(
        'POST',
        'http://h/a',
        new TypeError('fetch failed', {cause: new Error('boom')}),
        1,
      ),
    ).to.equal('POST http://h/a failed: boom');
  });

  it('shows the text of a value that is not an Error', () => {
    expect(fetchFailure('GET', '/x', 'plain', 1)).to.equal(
      'GET /x failed: plain',
    );
  });
});

describe('guardedStep', () => {
  const TIMEOUT_MS = 5000;
  const timeoutError = () =>
    new DOMException('The operation timed out.', 'TimeoutError');
  const fail = (cause: unknown) =>
    new RunError(fetchFailure('GET', '/x', cause, TIMEOUT_MS), {cause});

  it('gives the result of a step that works', async () => {
    expect(await guardedStep(async () => 42, undefined, fail)).to.equal(42);
  });

  it('builds the error for a timeout, and keeps the cause', async () => {
    const cause = timeoutError();

    const error = await guardedStep(
      () => Promise.reject(cause),
      undefined,
      fail,
    ).catch((err: unknown) => err);

    expect(error).to.be.instanceOf(RunError);
    expect((error as RunError).message).to.equal('GET /x timed out after 5 s');
    expect((error as RunError).cause).to.equal(cause);
  });

  it('builds the error for any other failure', async () => {
    const error = await guardedStep(
      () => Promise.reject(new Error('boom')),
      new AbortController().signal,
      fail,
    ).catch((err: unknown) => err);

    expect((error as RunError).message).to.equal('GET /x failed: boom');
  });

  it('throws the reason of a stop signal that is aborted, as it is', async () => {
    const reason = new Error('cancelled');

    const error = await guardedStep(
      () => Promise.reject(timeoutError()),
      AbortSignal.abort(reason),
      fail,
    ).catch((err: unknown) => err);

    expect(error).to.equal(reason);
  });
});

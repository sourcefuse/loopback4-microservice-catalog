// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {artilleryEnv} from '../../../../engine/artillery/env';

describe('artilleryEnv', () => {
  it('sets no LOAD_TESTS_TOKEN without a token, even if the CLI has one', () => {
    const env = artilleryEnv('http://app', undefined, {
      LOAD_TESTS_TOKEN: 'old',
    });

    expect(env).to.not.have.property('LOAD_TESTS_TOKEN');
  });

  it('has the base URL and the token', () => {
    const env = artilleryEnv('http://app', 'tok', {
      LOAD_TESTS_BASE_URL: 'http://other',
    });

    expect(env.LOAD_TESTS_BASE_URL).to.equal('http://app');
    expect(env.LOAD_TESTS_TOKEN).to.equal('tok');
  });

  it('drops the secrets of a CI job and the LOAD_TESTS_ variables', () => {
    const env = artilleryEnv('http://app', undefined, {
      GITHUB_TOKEN: 'g',
      AWS_SECRET_ACCESS_KEY: 'a',
      NODE_AUTH_TOKEN: 'n',
      ARTILLERY_CLOUD_API_KEY: 'c',
      LOAD_TESTS_PASSWORD: 'p',
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('passes the names of the allow-list, and every LC_ name', () => {
    const env = artilleryEnv('http://app', undefined, {
      PATH: '/bin',
      HOME: '/home/u',
      LC_ALL: 'C',
      HTTPS_PROXY: 'http://proxy',
      NODE_OPTIONS: '--max-old-space-size=512',
      ARTILLERY_WORKERS: '2',
    });

    expect(env).to.containEql({
      PATH: '/bin',
      HOME: '/home/u',
      LC_ALL: 'C',
      HTTPS_PROXY: 'http://proxy',
      NODE_OPTIONS: '--max-old-space-size=512',
      ARTILLERY_WORKERS: '2',
    });
  });

  it('does not pass ALL_PROXY and NO_PROXY: Artillery does not read them', () => {
    const env = artilleryEnv('http://app', undefined, {
      ALL_PROXY: 'http://user:secret@proxy',
      NO_PROXY: 'localhost',
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('compares the names without regard to letter case', () => {
    const env = artilleryEnv('http://app', undefined, {Path: 'C:\\bin'});

    expect(env.Path).to.equal('C:\\bin');
  });

  it('passes a name that the config asks for, and only when the CLI has it', () => {
    const env = artilleryEnv(
      'http://app',
      undefined,
      {MY_API_KEY: 'k', OTHER_KEY: 'o'},
      ['MY_API_KEY', 'NOT_SET'],
    );

    expect(env).to.containEql({MY_API_KEY: 'k'});
    expect(env).to.not.have.property('OTHER_KEY');
    expect(env).to.not.have.property('NOT_SET');
  });

  it('never passes a LOAD_TESTS_ name, also when the config asks for it', () => {
    const env = artilleryEnv(
      'http://app',
      undefined,
      {LOAD_TESTS_PASSWORD: 'p'},
      ['LOAD_TESTS_PASSWORD'],
    );

    expect(env).to.not.have.property('LOAD_TESTS_PASSWORD');
  });

  it('removes every variable that starts with LOAD_TESTS_, also one that the library does not know', () => {
    const env = artilleryEnv('http://app', undefined, {
      LOAD_TESTS_PASSWORD: 's',
      LOAD_TESTS_CLIENT_SECRET: 's',
      LOAD_TESTS_DB_URL: 'postgres://u:secret@db',
      LOAD_TESTS_USERNAME: 'u',
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('does not change the environment that it gets', () => {
    const source = {LOAD_TESTS_DB_URL: 'x'};

    artilleryEnv('http://app', 'tok', source);

    expect(source).to.deepEqual({LOAD_TESTS_DB_URL: 'x'});
  });

  it('reads process.env by default', () => {
    process.env.LT_ENV_TEST_VAR = 'v';
    try {
      expect(
        artilleryEnv('http://app', undefined, undefined, ['LT_ENV_TEST_VAR'])
          .LT_ENV_TEST_VAR,
      ).to.equal('v');
    } finally {
      delete process.env.LT_ENV_TEST_VAR;
    }
  });
});

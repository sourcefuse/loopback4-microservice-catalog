// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {artilleryEnv} from '../../../../engine/artillery/env';
import {UI_URL_ENV} from '../../../../project/layout';

describe('artilleryEnv', () => {
  it('sets no LOAD_TESTS_TOKEN without a token, even if the CLI has one', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        LOAD_TESTS_TOKEN: 'old',
      },
    });

    expect(env).to.not.have.property('LOAD_TESTS_TOKEN');
  });

  it('has the base URL and the token', () => {
    const env = artilleryEnv({
      url: 'http://app',
      token: 'tok',
      env: {
        LOAD_TESTS_BASE_URL: 'http://other',
      },
    });

    expect(env.LOAD_TESTS_BASE_URL).to.equal('http://app');
    expect(env.LOAD_TESTS_TOKEN).to.equal('tok');
  });

  it('drops the secrets of a CI job and the LOAD_TESTS_ variables', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        GITHUB_TOKEN: 'g',
        AWS_SECRET_ACCESS_KEY: 'a',
        NODE_AUTH_TOKEN: 'n',
        ARTILLERY_CLOUD_API_KEY: 'c',
        LOAD_TESTS_PASSWORD: 'p',
      },
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('gives a browser scenario the URL of the web app, and not the base URL', () => {
    const env = artilleryEnv({
      url: 'http://ui',
      env: {LOAD_TESTS_BASE_URL: 'http://api'},
      extraNames: [],
      urlName: UI_URL_ENV,
    });

    expect(env.LOAD_TESTS_UI_URL).to.equal('http://ui');
    expect(env).to.not.have.property('LOAD_TESTS_BASE_URL');
  });

  it('passes PLAYWRIGHT_BROWSERS_PATH, where a CI image can keep its browsers', () => {
    const env = artilleryEnv({
      url: 'http://ui',
      env: {
        PLAYWRIGHT_BROWSERS_PATH: '/ms-playwright',
      },
    });

    expect(env.PLAYWRIGHT_BROWSERS_PATH).to.equal('/ms-playwright');
  });

  it('passes the names of the allow-list, and every LC_ name', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        PATH: '/bin',
        HOME: '/home/u',
        LC_ALL: 'C',
        HTTPS_PROXY: 'http://proxy',
        NODE_OPTIONS: '--max-old-space-size=512',
      },
    });

    expect(env).to.containEql({
      PATH: '/bin',
      HOME: '/home/u',
      LC_ALL: 'C',
      HTTPS_PROXY: 'http://proxy',
      NODE_OPTIONS: '--max-old-space-size=512',
    });
  });

  it('passes XDG_CACHE_HOME, where Playwright looks for its browsers on Linux', () => {
    const env = artilleryEnv({
      url: 'http://ui',
      env: {
        XDG_CACHE_HOME: '/cache',
      },
    });

    expect(env.XDG_CACHE_HOME).to.equal('/cache');
  });

  it('does not pass ARTILLERY_WORKERS: Artillery does not read it', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        ARTILLERY_WORKERS: '2',
      },
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('does not pass ALL_PROXY and NO_PROXY: Artillery does not read them', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        ALL_PROXY: 'http://user:secret@proxy',
        NO_PROXY: 'localhost',
      },
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('compares the names without regard to letter case', () => {
    const env = artilleryEnv({url: 'http://app', env: {Path: 'C:\\bin'}});

    expect(env.Path).to.equal('C:\\bin');
  });

  it('passes a name that the config asks for, and only when the CLI has it', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {MY_API_KEY: 'k', OTHER_KEY: 'o'},
      extraNames: ['MY_API_KEY', 'NOT_SET'],
    });

    expect(env).to.containEql({MY_API_KEY: 'k'});
    expect(env).to.not.have.property('OTHER_KEY');
    expect(env).to.not.have.property('NOT_SET');
  });

  it('never passes a LOAD_TESTS_ name, also when the config asks for it', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {LOAD_TESTS_PASSWORD: 'p'},
      extraNames: ['LOAD_TESTS_PASSWORD'],
    });

    expect(env).to.not.have.property('LOAD_TESTS_PASSWORD');
  });

  it('removes every variable that starts with LOAD_TESTS_, also one that the library does not know', () => {
    const env = artilleryEnv({
      url: 'http://app',
      env: {
        LOAD_TESTS_PASSWORD: 's',
        LOAD_TESTS_CLIENT_SECRET: 's',
        LOAD_TESTS_DB_URL: 'postgres://u:secret@db',
        LOAD_TESTS_USERNAME: 'u',
      },
    });

    expect(Object.keys(env)).to.deepEqual(['LOAD_TESTS_BASE_URL']);
  });

  it('does not change the environment that it gets', () => {
    const source = {LOAD_TESTS_DB_URL: 'x'};

    artilleryEnv({url: 'http://app', token: 'tok', env: source});

    expect(source).to.deepEqual({LOAD_TESTS_DB_URL: 'x'});
  });

  it('reads process.env by default', () => {
    process.env.LT_ENV_TEST_VAR = 'v';
    try {
      expect(
        artilleryEnv({url: 'http://app', extraNames: ['LT_ENV_TEST_VAR']})
          .LT_ENV_TEST_VAR,
      ).to.equal('v');
    } finally {
      delete process.env.LT_ENV_TEST_VAR;
    }
  });
});

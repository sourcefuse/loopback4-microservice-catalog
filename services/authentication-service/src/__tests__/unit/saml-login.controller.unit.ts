// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {expect, sinon} from '@loopback/testlab';
import {Strategy} from '@node-saml/passport-saml';
import {getAuthenticateMetadata} from 'loopback4-authentication';
import * as zlib from 'node:zlib';

describe('SamlLoginController - Unit Tests', () => {
  const envKeys = [
    'SAML_CALLBACK_URL',
    'SAML_CERT',
    'SAML_ISSUER',
    'SAML_ENTRY_POINT',
    'VALIDATE_RESPONSE',
    'SAML_REQUEST_TTL_MS',
  ];
  const baseEnv: AnyObject = {
    SAML_CALLBACK_URL: 'https://sp.example.com/auth/saml-redirect',
    SAML_CERT: 'MIICdummycert',
    SAML_ISSUER: 'sp-issuer',
    SAML_ENTRY_POINT: 'https://idp.example.com/sso',
  };
  const saved: AnyObject = {};

  /** Decorator options are read from process.env at import time, so the controller is re-required per call. */
  function loadController(env: AnyObject): AnyObject {
    for (const key of envKeys) {
      delete process.env[key];
    }
    Object.assign(process.env, baseEnv, env);
    for (const file of Object.keys(require.cache)) {
      if (file.includes('saml-login.controller')) {
        delete require.cache[file];
      }
    }
    return require('../../modules/auth/controllers/saml-login.controller');
  }

  function loadOptions(method: string, env: AnyObject): AnyObject {
    const {SamlLoginController} = loadController(env);
    return getAuthenticateMetadata(SamlLoginController, method)!
      .options as AnyObject;
  }

  before(() => {
    for (const key of envKeys) {
      saved[key] = process.env[key];
    }
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
  });

  ['postLoginViaSaml', 'oktaSamlCallback'].forEach(method => {
    describe(method, () => {
      it('uses node-saml v5 option names and builds a Strategy', () => {
        const options = loadOptions(method, {});
        expect(options).to.have.property('callbackUrl');
        expect(options).to.have.property('idpCert');
        expect(options).to.not.have.property('callbackURL');
        expect(options).to.not.have.property('cert');
        expect(
          () =>
            new Strategy(
              options as never,
              () => undefined,
              () => undefined,
            ),
        ).to.not.throw();
      });

      it('skips InResponseTo validation when VALIDATE_RESPONSE is unset', () => {
        const options = loadOptions(method, {});
        expect(options.validateInResponseTo).to.equal('never');
      });

      it('validates InResponseTo always when VALIDATE_RESPONSE is 1', () => {
        const options = loadOptions(method, {VALIDATE_RESPONSE: '1'});
        expect(options.validateInResponseTo).to.equal('always');
      });

      it('skips InResponseTo validation when VALIDATE_RESPONSE is 0', () => {
        const options = loadOptions(method, {VALIDATE_RESPONSE: '0'});
        expect(options.validateInResponseTo).to.equal('never');
      });
    });
  });

  it("accepts a response to an AuthnRequest issued by the other route's Strategy", async () => {
    const {SamlLoginController} = loadController({VALIDATE_RESPONSE: '1'});
    const build = (method: string) =>
      new Strategy(
        getAuthenticateMetadata(SamlLoginController, method)!.options as never,
        () => undefined,
        () => undefined,
      ) as AnyObject;
    const issuer = build('postLoginViaSaml');
    const validator = build('oktaSamlCallback');

    const url = new URL(await issuer._saml.getAuthorizeUrlAsync('', undefined));
    const requestXml = zlib
      .inflateRawSync(
        Buffer.from(url.searchParams.get('SAMLRequest') ?? '', 'base64'),
      )
      .toString();
    const requestId = /ID="([^"]+)"/.exec(requestXml)![1];

    const respond = async (inResponseTo: string) => {
      const xml = `<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" InResponseTo="${inResponseTo}"/>`;
      try {
        await validator._saml.validatePostResponseAsync({
          SAMLResponse: Buffer.from(xml).toString('base64'),
        });
      } catch (err) {
        return (err as Error).message;
      }
      throw new Error('expected the response to be rejected');
    };

    expect(await respond(requestId)).to.not.match(/InResponseTo is not valid/);
    expect(await respond('_unknown')).to.match(/InResponseTo is not valid/);
  });

  it('expires cached requests after 8 hours and prunes them on the next save', async () => {
    const clock = sinon.useFakeTimers();
    try {
      const options = loadOptions('postLoginViaSaml', {VALIDATE_RESPONSE: '1'});
      const cache = options.cacheProvider;
      const hours = 60 * 60 * 1000;

      await cache.saveAsync('old', 'a');
      await cache.saveAsync('stale', 'c');
      clock.tick(7 * hours);
      expect(await cache.getAsync('old')).to.equal('a');

      clock.tick(2 * hours);
      expect(await cache.getAsync('old')).to.equal(null);
      await cache.saveAsync('new', 'b');
      expect(await cache.removeAsync('stale')).to.equal(null);
      expect(await cache.getAsync('new')).to.equal('b');
    } finally {
      clock.restore();
    }
  });

  [
    {value: '60000', expiresAfterMs: 60000},
    {value: 'abc', expiresAfterMs: 8 * 60 * 60 * 1000},
    {value: '-5', expiresAfterMs: 8 * 60 * 60 * 1000},
  ].forEach(({value, expiresAfterMs}) => {
    it(`expires cached requests after ${expiresAfterMs}ms when SAML_REQUEST_TTL_MS is ${value}`, async () => {
      const clock = sinon.useFakeTimers();
      try {
        const options = loadOptions('postLoginViaSaml', {
          VALIDATE_RESPONSE: '1',
          SAML_REQUEST_TTL_MS: value,
        });
        const cache = options.cacheProvider;

        await cache.saveAsync('id', 'a');
        clock.tick(expiresAfterMs - 1);
        expect(await cache.getAsync('id')).to.equal('a');
        clock.tick(1);
        expect(await cache.getAsync('id')).to.equal(null);
      } finally {
        clock.restore();
      }
    });
  });
});

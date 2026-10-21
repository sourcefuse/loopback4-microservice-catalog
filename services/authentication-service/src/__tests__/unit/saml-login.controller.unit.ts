// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import {Strategy} from '@node-saml/passport-saml';
import {getAuthenticateMetadata} from 'loopback4-authentication';

describe('SamlLoginController - Unit Tests', () => {
  const envKeys = [
    'SAML_CALLBACK_URL',
    'SAML_CERT',
    'SAML_ISSUER',
    'SAML_ENTRY_POINT',
    'VALIDATE_RESPONSE',
  ];
  const baseEnv: AnyObject = {
    SAML_CALLBACK_URL: 'https://sp.example.com/auth/saml-redirect',
    SAML_CERT: 'MIICdummycert',
    SAML_ISSUER: 'sp-issuer',
    SAML_ENTRY_POINT: 'https://idp.example.com/sso',
  };
  const saved: AnyObject = {};

  /** Decorator options are read from process.env at import time, so the controller is re-required per call. */
  function loadOptions(method: string, env: AnyObject): AnyObject {
    for (const key of envKeys) {
      delete process.env[key];
    }
    Object.assign(process.env, baseEnv, env);
    for (const file of Object.keys(require.cache)) {
      if (file.includes('saml-login.controller')) {
        delete require.cache[file];
      }
    }
    const {
      SamlLoginController,
    } = require('../../modules/auth/controllers/saml-login.controller');
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

      it('validates InResponseTo always when VALIDATE_RESPONSE is unset', () => {
        const options = loadOptions(method, {});
        expect(options.validateInResponseTo).to.equal('always');
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
});

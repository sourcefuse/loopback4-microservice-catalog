// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {
  decodeSamlSession,
  encodeSamlSession,
  isSamlSessionToken,
  readSamlLogoutConfig,
  SamlLogoutService,
} from '../../services/saml-logout.service';

const SLO_ENV: Record<string, string> = {
  SAML_ISSUER: 'sp-issuer',
  SAML_CERT: 'MIICdummycert',
  SAML_ENTRY_POINT: 'https://idp.example.com/sso',
  SAML_CALLBACK_URL: 'https://sp.example.com/auth/saml-redirect?client=web',
  SAML_SESSION_LOGOUT_URL: 'https://idp.example.com/slo',
  SAML_SP_PRIVATE_KEY: String.raw`line1\nline2`,
  SAML_LOGOUT_REDIRECT_URL: 'https://app.example.com/login',
};

// the unescaped SAML_SP_PRIVATE_KEY, which readSamlLogoutConfig exposes as sessionSecret
const SESSION_SECRET = 'line1\nline2';
// an OAuth-style token: anything without the SAML session prefix
const NON_SAML_TOKEN = 'eyJhbGciOi.keycloak';
const SLO_REQUEST_URL = 'https://idp.example.com/slo?SAMLRequest=x';

const session = {
  nameID: 'j.doe@example.com',
  nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  sessionIndex: 'idp-session-1',
};

describe('SamlLogoutService - Unit Tests', () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const [key, value] of Object.entries(SLO_ENV)) {
      saved[key] = process.env[key];
      process.env[key] = value;
    }
  });

  afterEach(() => {
    for (const key of Object.keys(SLO_ENV)) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
  });

  describe('session reference helpers', () => {
    it('round-trips a SAML session reference', () => {
      const token = encodeSamlSession(session, SESSION_SECRET);

      expect(isSamlSessionToken(token)).to.be.true();
      expect(decodeSamlSession(token, SESSION_SECRET)).to.containDeep(session);
    });

    it('keeps NameID qualifiers so the LogoutRequest names the same principal', () => {
      const qualified = {
        ...session,
        nameQualifier: 'https://idp.example.com',
        spNameQualifier: 'sp-affiliation',
      };

      expect(
        decodeSamlSession(
          encodeSamlSession(qualified, SESSION_SECRET),
          SESSION_SECRET,
        ),
      ).to.containDeep(qualified);
    });

    it('is opaque: the NameID and SessionIndex cannot be read from the reference', () => {
      const token = encodeSamlSession(session, SESSION_SECRET);
      const payload = Buffer.from(token.slice('saml:'.length), 'base64url');

      expect(payload.toString('latin1')).to.not.containEql(session.nameID);
      expect(payload.toString('latin1')).to.not.containEql(
        session.sessionIndex,
      );
      expect(token).to.not.equal(encodeSamlSession(session, SESSION_SECRET));
    });

    it('cannot be read with another key', () => {
      const token = encodeSamlSession(session, SESSION_SECRET);

      expect(decodeSamlSession(token, 'another-key')).to.be.undefined();
    });

    it('rejects anything that is not a well-formed SAML session reference', () => {
      expect(isSamlSessionToken(NON_SAML_TOKEN)).to.be.false();
      expect(isSamlSessionToken()).to.be.false();
      expect(
        decodeSamlSession(NON_SAML_TOKEN, SESSION_SECRET),
      ).to.be.undefined();
      expect(
        decodeSamlSession('saml:not-encrypted', SESSION_SECRET),
      ).to.be.undefined();
      expect(
        decodeSamlSession(encodeSamlSession(session, SESSION_SECRET), ''),
      ).to.be.undefined();
    });
  });

  describe('readSamlLogoutConfig', () => {
    it('builds signed logout options when everything is configured', () => {
      const config = readSamlLogoutConfig();

      expect(config?.postLogoutRedirectUrl).to.equal(
        SLO_ENV.SAML_LOGOUT_REDIRECT_URL,
      );
      expect(config?.sessionSecret).to.equal(SESSION_SECRET);
      expect(config?.samlOptions).to.containDeep({
        issuer: SLO_ENV.SAML_ISSUER,
        logoutUrl: SLO_ENV.SAML_SESSION_LOGOUT_URL,
        privateKey: SESSION_SECRET,
        signatureAlgorithm: 'sha256',
      });
    });

    it('is off when any Single Logout or login setting is missing', () => {
      for (const key of Object.keys(SLO_ENV)) {
        const value = process.env[key];
        process.env[key] = '';
        expect(readSamlLogoutConfig()).to.be.undefined();
        process.env[key] = value;
      }
    });
  });

  describe('buildLogoutUrl', () => {
    const logger = {info: sinon.stub(), error: sinon.stub()};

    function serviceWith(logout: sinon.SinonStub) {
      const factory = sinon.stub().returns({logout});
      const service = new SamlLogoutService(
        sinon.stub().resolves(factory),
        logger as never,
      );
      return {service, factory};
    }

    it('builds the signed logout URL for the stored SAML session', async () => {
      const logout = sinon
        .stub()
        .callsFake((_req, cb) => cb(null, SLO_REQUEST_URL));
      const {service, factory} = serviceWith(logout);

      const url = await service.buildLogoutUrl(
        encodeSamlSession(session, SESSION_SECRET),
      );

      expect(url).to.equal(SLO_REQUEST_URL);
      expect(factory.firstCall.args[0]).to.containDeep({
        logoutUrl: SLO_ENV.SAML_SESSION_LOGOUT_URL,
        privateKey: SESSION_SECRET,
      });
      expect(logout.firstCall.args[0].user).to.containDeep({
        issuer: SLO_ENV.SAML_ISSUER,
        ...session,
      });
    });

    it('passes NameID qualifiers through to the LogoutRequest', async () => {
      const logout = sinon
        .stub()
        .callsFake((_req, cb) => cb(null, SLO_REQUEST_URL));
      const {service} = serviceWith(logout);
      const qualified = {
        ...session,
        nameQualifier: 'https://idp.example.com',
        spNameQualifier: 'sp-affiliation',
      };

      await service.buildLogoutUrl(
        encodeSamlSession(qualified, SESSION_SECRET),
      );

      expect(logout.firstCall.args[0].user).to.containDeep(qualified);
    });

    it('returns null for a session that is not a SAML one', async () => {
      const logout = sinon.stub();
      const {service} = serviceWith(logout);

      expect(await service.buildLogoutUrl(NON_SAML_TOKEN)).to.be.null();
      sinon.assert.notCalled(logout);
    });

    it('returns null when Single Logout is not configured', async () => {
      process.env.SAML_SESSION_LOGOUT_URL = '';
      const logout = sinon.stub();
      const {service} = serviceWith(logout);

      expect(
        await service.buildLogoutUrl(
          encodeSamlSession(session, SESSION_SECRET),
        ),
      ).to.be.null();
      sinon.assert.notCalled(logout);
    });

    it('returns null when the reference was encrypted with a rotated key', async () => {
      const logout = sinon.stub();
      const {service} = serviceWith(logout);

      expect(
        await service.buildLogoutUrl(encodeSamlSession(session, 'old-key')),
      ).to.be.null();
      sinon.assert.notCalled(logout);
    });

    it('returns null instead of failing the logout when signing fails', async () => {
      const logout = sinon
        .stub()
        .callsFake((_req, cb) => cb(new Error('bad key')));
      const {service} = serviceWith(logout);

      expect(
        await service.buildLogoutUrl(
          encodeSamlSession(session, SESSION_SECRET),
        ),
      ).to.be.null();
    });
  });
});

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {SuccessResponse} from '@sourceloop/core';
import {SamlLogoutController} from '../../opt-in';
import {SamlVerifyProvider} from '../../modules/auth/providers/saml-verify.provider';
import {IdpLoginService} from '../../services/idp-login.service';
import {
  decodeSamlSession,
  encodeSamlSession,
  SAML_NAMEID_FORMAT_UNSPECIFIED,
} from '../../services/saml-logout.service';

const SLO_ENV: Record<string, string> = {
  SAML_ISSUER: 'sp-issuer',
  SAML_CERT: 'MIICdummycert',
  SAML_ENTRY_POINT: 'https://idp.example.com/sso',
  SAML_CALLBACK_URL: 'https://sp.example.com/auth/saml-redirect?client=web',
  SAML_SESSION_LOGOUT_URL: 'https://idp.example.com/slo',
  SAML_SP_PRIVATE_KEY: 'private-key',
  SAML_LOGOUT_REDIRECT_URL: 'https://app.example.com/login',
};

const USER_ID = 'user-1';
const EMAIL = 'j.doe@example.com';
const EMAIL_FORMAT = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';
const SESSION_INDEX = 'idp-session-1';
const PROFILE_ID = 'saml-profile-id';
const SLO_REQUEST_URL = 'https://idp.example.com/slo?SAMLRequest=x';

// SAML_SP_PRIVATE_KEY has no escaped line breaks, so it is the session secret as-is
const SESSION_SECRET = SLO_ENV.SAML_SP_PRIVATE_KEY;

const sessionRef = {
  nameID: EMAIL,
  nameIDFormat: EMAIL_FORMAT,
  sessionIndex: SESSION_INDEX,
};
const samlSession = encodeSamlSession(sessionRef, SESSION_SECRET);

/** Applies the Single Logout env and returns a function restoring the previous values. */
function applySloEnv(): () => void {
  const saved: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(SLO_ENV)) {
    saved[key] = process.env[key];
    process.env[key] = value;
  }
  return () => {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };
}

type WithExternalTokens = {
  externalAuthToken?: string;
  externalRefreshToken?: string;
};

const providerLogger = {warn: sinon.stub(), error: sinon.stub()};

/** Runs the SAML verifier for a profile; value() is typed as IAuthUser, which lacks externalAuthToken. */
async function verify(
  profileOverrides: Record<string, unknown>,
  samlSingleLogout = true,
): Promise<WithExternalTokens | null> {
  const passThrough = (_profile: unknown, user: unknown) =>
    Promise.resolve(user);
  const provider = new SamlVerifyProvider(
    {findOne: sinon.stub().resolves({id: USER_ID, email: EMAIL})} as never,
    {
      findOne: sinon
        .stub()
        .resolves({authProvider: 'saml', authId: PROFILE_ID}),
    } as never,
    sinon.stub() as never,
    sinon.stub().callsFake(passThrough) as never,
    sinon.stub().callsFake(passThrough) as never,
    {samlSingleLogout},
    providerLogger as never,
  );
  return (await provider.value()({
    id: PROFILE_ID,
    email: EMAIL,
    issuer: 'https://idp.example.com',
    nameID: EMAIL,
    nameIDFormat: EMAIL_FORMAT,
    sessionIndex: SESSION_INDEX,
    ...profileOverrides,
  } as never)) as WithExternalTokens | null;
}

/** IdpLoginService with only the user repository wired; getUser needs nothing else. */
function serviceWithUser(): IdpLoginService {
  const userRepo = {
    findById: sinon.stub().callsFake(() => Promise.resolve({id: USER_ID})),
  };
  const args = new Array(17).fill({});
  args[1] = userRepo;
  return new (
    IdpLoginService as unknown as new (...a: unknown[]) => IdpLoginService
  )(...args);
}

describe('SAML Single Logout - Unit Tests', () => {
  describe('SamlLogoutController.samlLogout', () => {
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    let refreshTokenRepo: {get: sinon.SinonStub};
    let idpLoginService: {logoutUser: sinon.SinonStub};
    let samlLogoutService: {buildLogoutUrl: sinon.SinonStub};
    let logger: {info: sinon.SinonStub; error: sinon.SinonStub};
    let controller: SamlLogoutController;

    beforeEach(() => {
      refreshTokenRepo = {
        get: sinon.stub().resolves({
          userId: USER_ID,
          accessToken,
          externalAuthToken: samlSession,
        }),
      };
      idpLoginService = {
        logoutUser: sinon
          .stub()
          .resolves(new SuccessResponse({success: true, key: USER_ID})),
      };
      samlLogoutService = {
        buildLogoutUrl: sinon.stub().resolves(SLO_REQUEST_URL),
      };
      logger = {info: sinon.stub(), error: sinon.stub()};
      controller = new SamlLogoutController(
        refreshTokenRepo as never,
        logger as never,
        idpLoginService as never,
        samlLogoutService as never,
      );
    });

    it('ends the session and returns the SAML logout URL', async () => {
      const res = await controller.samlLogout(`Bearer ${accessToken}`, {
        refreshToken,
      } as never);

      expect(res.toJSON()).to.eql({
        success: true,
        key: USER_ID,
        logoutUrl: SLO_REQUEST_URL,
      });
      sinon.assert.calledWith(
        samlLogoutService.buildLogoutUrl,
        samlSession,
        USER_ID,
      );
      sinon.assert.calledOnce(idpLoginService.logoutUser);
      // the URL is built before logoutUser deletes the record holding the session
      sinon.assert.callOrder(
        samlLogoutService.buildLogoutUrl,
        idpLoginService.logoutUser,
      );
    });

    it('still ends the session when no SAML logout URL is available', async () => {
      samlLogoutService.buildLogoutUrl.resolves(null);

      const res = await controller.samlLogout(`Bearer ${accessToken}`, {
        refreshToken,
      } as never);

      expect(res.logoutUrl).to.be.null();
      sinon.assert.calledOnce(idpLoginService.logoutUser);
    });

    it('rejects a refresh token that belongs to another access token', async () => {
      refreshTokenRepo.get.resolves({userId: USER_ID, accessToken: 'other'});

      await expect(
        controller.samlLogout(`Bearer ${accessToken}`, {refreshToken} as never),
      ).to.be.rejectedWith(/Token Invalid/);
      sinon.assert.notCalled(samlLogoutService.buildLogoutUrl);
      sinon.assert.notCalled(idpLoginService.logoutUser);
    });

    it('rejects a missing refresh token', async () => {
      await expect(
        controller.samlLogout(`Bearer ${accessToken}`, {} as never),
      ).to.be.rejectedWith(/TokenMissing/);
    });

    it('logs and rethrows when logoutUser fails after the URL is built', async () => {
      idpLoginService.logoutUser.rejects(new Error('user lookup failed'));

      await expect(
        controller.samlLogout(`Bearer ${accessToken}`, {refreshToken} as never),
      ).to.be.rejectedWith(/user lookup failed/);
      sinon.assert.calledOnce(logger.error);
      expect(logger.error.firstCall.args[0])
        .to.containEql(`userId=${USER_ID}`)
        .and.containEql('sloUrlBuilt=true');
    });
  });

  describe('SamlLogoutController.samlLogoutCallback', () => {
    let restoreEnv: () => void;
    let response: {redirect: sinon.SinonStub};
    let controller: SamlLogoutController;

    beforeEach(() => {
      restoreEnv = applySloEnv();
      response = {redirect: sinon.stub()};
      controller = new SamlLogoutController(
        {} as never,
        {info: sinon.stub(), error: sinon.stub()} as never,
        {} as never,
        {} as never,
      );
    });

    afterEach(() => restoreEnv());

    it('redirects with 303 to the configured post-logout page', () => {
      controller.samlLogoutCallback(response as never);

      sinon.assert.calledOnceWithExactly(
        response.redirect,
        303,
        SLO_ENV.SAML_LOGOUT_REDIRECT_URL,
      );
    });

    it('accepts the HTTP-Redirect (GET) binding with the same 303', () => {
      controller.samlLogoutCallbackRedirect(response as never);

      sinon.assert.calledOnceWithExactly(
        response.redirect,
        303,
        SLO_ENV.SAML_LOGOUT_REDIRECT_URL,
      );
    });

    it('is not found when Single Logout is not configured', () => {
      delete process.env.SAML_LOGOUT_REDIRECT_URL;

      expect(() => controller.samlLogoutCallback(response as never)).to.throw(
        /Not Found/,
      );
      sinon.assert.notCalled(response.redirect);
    });
  });

  describe('SamlVerifyProvider session reference', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = applySloEnv();
      providerLogger.warn.resetHistory();
      providerLogger.error.resetHistory();
    });

    afterEach(() => restoreEnv());

    it('keeps the IdP session (NameID + SessionIndex) for Single Logout', async () => {
      const authUser = await verify({});

      expect(
        decodeSamlSession(authUser?.externalAuthToken, SESSION_SECRET),
      ).to.containDeep(sessionRef);
    });

    it('keeps NameID qualifiers for IdPs that issue qualified identifiers', async () => {
      const qualifiers = {
        nameQualifier: 'https://idp.example.com',
        spNameQualifier: 'sp-affiliation',
      };

      const authUser = await verify(qualifiers);

      expect(
        decodeSamlSession(authUser?.externalAuthToken, SESSION_SECRET),
      ).to.containDeep(qualifiers);
    });

    it('falls back to the unspecified NameID format when Format is omitted', async () => {
      const authUser = await verify({nameIDFormat: undefined});

      expect(
        decodeSamlSession(authUser?.externalAuthToken, SESSION_SECRET)
          ?.nameIDFormat,
      ).to.equal(SAML_NAMEID_FORMAT_UNSPECIFIED);
    });

    it('stores no session reference and warns when the SLO environment is incomplete', async () => {
      delete process.env.SAML_SESSION_LOGOUT_URL;

      const authUser = await verify({});

      expect(authUser?.externalAuthToken).to.be.undefined();
      sinon.assert.calledWithMatch(
        providerLogger.warn,
        /environment is incomplete/,
      );
    });

    it('stores no session reference and warns when the IdP sent no NameID', async () => {
      const authUser = await verify({nameID: undefined});

      expect(authUser?.externalAuthToken).to.be.undefined();
      sinon.assert.calledWithMatch(providerLogger.warn, /no NameID/);
    });

    it('stores no session reference unless the application opted in (default)', async () => {
      const authUser = await verify({}, false);

      expect(authUser?.externalAuthToken).to.be.undefined();
    });
  });

  describe('IdpLoginService.getUser', () => {
    it('carries a SAML session ref on refresh even without an external refresh token', async () => {
      const user = (await serviceWithUser().getUser({
        userId: USER_ID,
        externalAuthToken: samlSession,
      } as never)) as WithExternalTokens;

      expect(user.externalAuthToken).to.equal(samlSession);
    });

    it('still carries both external tokens for OAuth logins', async () => {
      const user = (await serviceWithUser().getUser({
        userId: USER_ID,
        externalAuthToken: 'oauth-access',
        externalRefreshToken: 'oauth-refresh',
      } as never)) as WithExternalTokens;

      expect(user.externalAuthToken).to.equal('oauth-access');
      expect(user.externalRefreshToken).to.equal('oauth-refresh');
    });
  });
});

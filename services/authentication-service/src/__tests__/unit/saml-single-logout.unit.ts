// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {SuccessResponse} from '@sourceloop/core';
import {LogoutController} from '../../modules/auth/controllers/logout.controller';
import {SamlLoginController} from '../../modules/auth/controllers/saml-login.controller';
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

const samlSession = encodeSamlSession({
  nameID: 'j.doe@example.com',
  nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  sessionIndex: 'idp-session-1',
});

describe('SAML Single Logout - Unit Tests', () => {
  describe('LogoutController.samlLogout', () => {
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    let refreshTokenRepo: {get: sinon.SinonStub};
    let idpLoginService: {logoutUser: sinon.SinonStub};
    let samlLogoutService: {buildLogoutUrl: sinon.SinonStub};
    let controller: LogoutController;

    beforeEach(() => {
      refreshTokenRepo = {
        get: sinon.stub().resolves({
          userId: 'user-1',
          accessToken,
          externalAuthToken: samlSession,
        }),
      };
      idpLoginService = {
        logoutUser: sinon
          .stub()
          .resolves(new SuccessResponse({success: true, key: 'user-1'})),
      };
      samlLogoutService = {
        buildLogoutUrl: sinon.stub().resolves('https://idp.example.com/slo?SAMLRequest=x'),
      };
      controller = new LogoutController(
        {} as never,
        {} as never,
        refreshTokenRepo as never,
        {info: sinon.stub(), error: sinon.stub()} as never,
        {} as never,
        'id' as never,
        {} as never,
        {} as never,
        {} as never,
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
        key: 'user-1',
        logoutUrl: 'https://idp.example.com/slo?SAMLRequest=x',
      });
      sinon.assert.calledWith(samlLogoutService.buildLogoutUrl, samlSession);
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
      refreshTokenRepo.get.resolves({userId: 'user-1', accessToken: 'other'});

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
  });

  describe('SamlLoginController.samlLogoutCallback', () => {
    const saved: Record<string, string | undefined> = {};
    let response: {redirect: sinon.SinonStub};
    let controller: SamlLoginController;

    beforeEach(() => {
      for (const [key, value] of Object.entries(SLO_ENV)) {
        saved[key] = process.env[key];
        process.env[key] = value;
      }
      response = {redirect: sinon.stub()};
      controller = new SamlLoginController(
        {} as never,
        {error: sinon.stub()} as never,
        sinon.stub() as never,
      );
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

    it('redirects with 303 to the configured post-logout page', () => {
      controller.samlLogoutCallback(response as never);

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
    function verify(profileOverrides: Record<string, unknown>) {
      const user = {id: 'user-1', email: 'j.doe@example.com'};
      const provider = new SamlVerifyProvider(
        {findOne: sinon.stub().resolves(user)} as never,
        {
          findOne: sinon
            .stub()
            .resolves({authProvider: 'saml', authId: 'saml-profile-id'}),
        } as never,
        sinon.stub() as never,
        sinon.stub().callsFake(async (_profile, u) => u) as never,
        sinon.stub().callsFake(async (_profile, u) => u) as never,
      );
      return provider.value()({
        id: 'saml-profile-id',
        email: 'j.doe@example.com',
        issuer: 'https://idp.example.com',
        nameID: 'j.doe@example.com',
        nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        sessionIndex: 'idp-session-1',
        ...profileOverrides,
      } as never);
    }

    it('keeps the IdP session (NameID + SessionIndex) for Single Logout', async () => {
      const authUser = await verify({});

      expect(decodeSamlSession(authUser?.externalAuthToken)).to.eql({
        nameID: 'j.doe@example.com',
        nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        sessionIndex: 'idp-session-1',
      });
    });

    it('falls back to the unspecified NameID format when Format is omitted', async () => {
      const authUser = await verify({nameIDFormat: undefined});

      expect(
        decodeSamlSession(authUser?.externalAuthToken)?.nameIDFormat,
      ).to.equal(SAML_NAMEID_FORMAT_UNSPECIFIED);
    });
  });

  describe('IdpLoginService.getUser', () => {
    function serviceWithUser() {
      const userRepo = {
        findById: sinon.stub().callsFake(async () => ({id: 'user-1'})),
      };
      const args = new Array(17).fill({});
      args[1] = userRepo;
      return new (IdpLoginService as unknown as new (
        ...a: unknown[]
      ) => IdpLoginService)(...args);
    }

    it('carries a SAML session ref on refresh even without an external refresh token', async () => {
      const user = await serviceWithUser().getUser({
        userId: 'user-1',
        externalAuthToken: samlSession,
      } as never);

      expect((user as {externalAuthToken?: string}).externalAuthToken).to.equal(
        samlSession,
      );
    });

    it('still carries both external tokens for OAuth logins', async () => {
      const user = (await serviceWithUser().getUser({
        userId: 'user-1',
        externalAuthToken: 'oauth-access',
        externalRefreshToken: 'oauth-refresh',
      } as never)) as {externalAuthToken?: string; externalRefreshToken?: string};

      expect(user.externalAuthToken).to.equal('oauth-access');
      expect(user.externalRefreshToken).to.equal('oauth-refresh');
    });
  });
});

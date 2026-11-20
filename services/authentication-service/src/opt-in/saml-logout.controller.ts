// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  getModelSchemaRefSF,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, AuthErrorKeys, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {RefreshTokenRequest, SamlLogoutResponseDto} from '../models';
import {RefreshTokenRepository} from '../repositories';
import {
  IdpLoginService,
  readSamlLogoutConfig,
  SamlLogoutService,
} from '../services';

/**
 * SAML Single Logout routes. Opt-in: this controller is mounted only when
 * `samlSingleLogout: true` is set in AuthServiceBindings.Config, because ending
 * the IdP session signs the user out of every application sharing that SSO.
 *
 * It lives in `src/opt-in`, outside the `controllers`/`modules` dirs the
 * component's CoreControllerBooter scans, so it is never mounted automatically.
 */
export class SamlLogoutController {
  constructor(
    @repository(RefreshTokenRepository)
    private readonly refreshTokenRepo: RefreshTokenRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
    @inject('services.SamlLogoutService')
    private readonly samlLogoutService: SamlLogoutService,
  ) {}

  /**
   * Logout for a SAML session: ends the application session exactly like
   * /logout and also returns a signed SAML LogoutRequest URL. The client sends
   * the browser there so the IdP ends its own session; the IdP then returns to
   * /auth/saml/logout. logoutUrl is null when the session is not a SAML one or
   * Single Logout is not configured for the environment.
   */
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  // allow-any-authenticated, like the other logout routes: it only ever ends
  // the caller's own session (the refresh token must belong to the access token)
  @authorize({permissions: ['*']})
  @post('/saml/logout', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'Logs the user out of the application and returns the SAML Single Logout URL for a SAML session.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Logout result with the SAML logout URL (or null)',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(SamlLogoutResponseDto),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async samlLogout(
    @param.header.string('Authorization', {
      description:
        'This is the access token which is required to authenticate user.',
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SamlLogoutResponseDto> {
    const token = auth?.replace(/bearer /i, '');
    if (!token || !req.refreshToken) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }
    const refreshTokenModel = await this.refreshTokenRepo.get(req.refreshToken);
    if (!refreshTokenModel) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }
    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    // built before logoutUser deletes the refresh record holding the SAML session ref
    const logoutUrl = await this.samlLogoutService.buildLogoutUrl(
      refreshTokenModel.externalAuthToken,
      refreshTokenModel.userId,
    );
    let key: string | undefined;
    try {
      ({key} = await this.idpLoginService.logoutUser(auth, req));
    } catch (error) {
      // logoutUser is not atomic: the tokens may already be revoked, so record
      // that this logout was half-done and whether the IdP URL was lost
      this.logger.error(
        `[SamlLogoutController] SAML logout failed after building the logout URL :: userId=${refreshTokenModel.userId} :: sloUrlBuilt=${!!logoutUrl} :: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
    this.logger.info(
      `[SamlLogoutController] SAML logout :: userId=${key} :: sloUrlBuilt=${!!logoutUrl}`,
    );
    return new SamlLogoutResponseDto({success: true, key, logoutUrl});
  }

  // Pre-auth by design: the IdP returns the LogoutResponse from the browser
  // after the application session is already gone, so there is no token to
  // authenticate. Both handlers stay side-effect free — they only redirect to
  // the server-configured URL and never read or reflect the IdP's data.
  // Only SP-initiated logout is supported: an IdP-initiated LogoutRequest
  // (SAMLRequest) is not processed here.
  @authorize({permissions: ['*']})
  @post('/auth/saml/logout', {
    description:
      'SAML Single Logout return (HTTP-POST binding) — redirects to the configured post-logout page (SAML_LOGOUT_REDIRECT_URL).',
    responses: {
      [STATUS_CODE.SEE_OTHER]: {
        description: 'Redirect (303) — see the Location header',
        headers: {Location: {schema: {type: 'string'}}},
      },
    },
  })
  samlLogoutCallback(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody({
      content: {
        [CONTENT_TYPE.FORM_URLENCODED]: {},
      },
      required: false,
    })
    _samlData?: AnyObject, //NOSONAR
  ): void {
    this.redirectAfterLogout(response);
  }

  @authorize({permissions: ['*']})
  @get('/auth/saml/logout', {
    description:
      'SAML Single Logout return (HTTP-Redirect binding, used by e.g. Entra ID) — redirects to the configured post-logout page (SAML_LOGOUT_REDIRECT_URL).',
    responses: {
      [STATUS_CODE.SEE_OTHER]: {
        description: 'Redirect (303) — see the Location header',
        headers: {Location: {schema: {type: 'string'}}},
      },
    },
  })
  samlLogoutCallbackRedirect(
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): void {
    this.redirectAfterLogout(response);
  }

  private redirectAfterLogout(response: Response): void {
    const config = readSamlLogoutConfig();
    if (!config) {
      throw new HttpErrors.NotFound();
    }
    // 303 so a POST from the IdP is followed with a GET of the post-logout page
    response.redirect(STATUS_CODE.SEE_OTHER, config.postLogoutRedirectUrl);
  }
}

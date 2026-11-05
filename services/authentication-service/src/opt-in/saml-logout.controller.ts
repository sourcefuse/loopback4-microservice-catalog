// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
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
    );
    const {key} = await this.idpLoginService.logoutUser(auth, req);
    this.logger.info(
      `[SamlLogoutController] SAML logout :: userId=${key} :: sloUrlBuilt=${!!logoutUrl}`,
    );
    return new SamlLogoutResponseDto({success: true, key, logoutUrl});
  }

  // Pre-auth by design: the IdP posts the LogoutResponse from the browser after
  // the application session is already gone, so there is no token to
  // authenticate. Keep this handler side-effect free — it only redirects to
  // the server-configured URL and never reads or reflects the posted data.
  @authorize({permissions: ['*']})
  @post('/auth/saml/logout', {
    description:
      'SAML Single Logout return (POST binding) — redirects to the configured post-logout page (SAML_LOGOUT_REDIRECT_URL).',
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
    const config = readSamlLogoutConfig();
    if (!config) {
      throw new HttpErrors.NotFound();
    }
    // 303 so the IdP's POST is followed with a GET of the post-logout page
    response.redirect(STATUS_CODE.SEE_OTHER, config.postLogoutRedirectUrl);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  RequestContext,
  RestBindings,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  SuccessResponse,
  X_TS_TYPE,
} from '@sourceloop/core';
import { encode } from 'base-64';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  authenticate,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { AuthServiceBindings } from '../../../keys';
import { RefreshTokenRequest } from '../../../models';
import {
  LoginActivityRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories';
import { IdpLoginService } from '../../../services';
import { ActorId } from '../../../types';

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

const getProxyAgent = () => {
  if (proxyUrl) {
    return new HttpsProxyAgent(proxyUrl);
  }
  return undefined;
};
const SUCCESS_RESPONSE = 'Success Response';
const AUTHENTICATE_USER =
  'This is the access token which is required to authenticate user.';

export class LogoutController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @repository(RevokedTokenRepository)
    private readonly revokedTokens: RevokedTokenRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(LoginActivityRepository)
    private readonly loginActivityRepo: LoginActivityRepository,
    @inject(AuthServiceBindings.ActorIdKey)
    private readonly actorKey: ActorId,
    @inject.context() private readonly ctx: RequestContext,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({ permissions: ['*'] })
  @post('/logout', {
    security: OPERATION_SECURITY_SPEC,
    description: 'To logout',
    responses: {
      [STATUS_CODE.OK]: {
        description: SUCCESS_RESPONSE,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { [X_TS_TYPE]: SuccessResponse },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async logout(
    @param.header.string('Authorization', {
      description: AUTHENTICATE_USER,
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SuccessResponse> {
    return this.idpLoginService.logoutUser(auth, req);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({ permissions: ['*'] })
  @post('/keycloak/logout', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'This API will log out the user from application as well as keycloak',
    responses: {
      [STATUS_CODE.OK]: {
        description: SUCCESS_RESPONSE,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { [X_TS_TYPE]: SuccessResponse },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async keycloakLogout(
    @param.header.string('Authorization', {
      description: AUTHENTICATE_USER,
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SuccessResponse> {
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

    if (refreshTokenModel.externalRefreshToken) {
      const params = new URLSearchParams();
      const logoutUrl = `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`;
      params.append('refresh_token', refreshTokenModel.externalRefreshToken);
      const strToEncode = `${process.env.KEYCLOAK_CLIENT_ID}:${process.env.KEYCLOAK_CLIENT_SECRET}`;
      fetch(logoutUrl, {
        agent: getProxyAgent(),
        method: 'post',
        body: params,
        headers: {
          Authorization: `Basic ${encode(strToEncode)}`,
        },
      })
        .then(() => {
          this.logger.info(
            `User ${refreshTokenModel.username} logged off successfully from keycloak.`,
          );
        })
        .catch(err => {
          this.logger.error(
            `Error while logging off from keycloak. Error :: ${err} ${JSON.stringify(
              err,
            )}`,
          );
        });
    }

    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokens.set(token, { token });
    await this.refreshTokenRepo.delete(req.refreshToken);
    if (refreshTokenModel.pubnubToken) {
      await this.refreshTokenRepo.delete(refreshTokenModel.pubnubToken);
    }

    return new SuccessResponse({
      success: true,

      key: refreshTokenModel.userId,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({ permissions: ['*'] })
  @post('/google/logout', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'This API will log out the user from application as well as google',
    responses: {
      [STATUS_CODE.OK]: {
        description: SUCCESS_RESPONSE,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { [X_TS_TYPE]: SuccessResponse },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async googleLogout(
    @param.header.string('Authorization', {
      description: AUTHENTICATE_USER,
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SuccessResponse> {
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

    if (refreshTokenModel.externalRefreshToken) {
      const params = new URLSearchParams();
      const logoutUrl = `https://oauth2.googleapis.com/revoke?token=${refreshTokenModel.externalAuthToken}`;
      params.append('refresh_token', refreshTokenModel.externalRefreshToken);
      fetch(logoutUrl, {
        agent: getProxyAgent(),
        method: 'post',
        body: params,
        headers: {
          'Content-type': CONTENT_TYPE.JSON,
        },
      })
        .then(() => {
          this.logger.info(
            `User ${refreshTokenModel.username} logged off successfully from google.`,
          );
        })
        .catch(err => {
          this.logger.error(
            `Error while logging off from google. Error :: ${err} ${JSON.stringify(
              err,
            )}`,
          );
        });
    }

    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokens.set(token, { token });
    await this.refreshTokenRepo.delete(req.refreshToken);
    if (refreshTokenModel.pubnubToken) {
      await this.refreshTokenRepo.delete(refreshTokenModel.pubnubToken);
    }

    return new SuccessResponse({
      success: true,

      key: refreshTokenModel.userId,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({ permissions: ['*'] })
  @post('/cognito/logout', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'This API will log out the user from application as well as cognito',
    responses: {
      [STATUS_CODE.OK]: {
        description: SUCCESS_RESPONSE,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { [X_TS_TYPE]: SuccessResponse },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async cognitoLogout(
    @param.header.string('Authorization', {
      description: AUTHENTICATE_USER,
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SuccessResponse> {
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

    if (refreshTokenModel.externalRefreshToken) {
      const revokeUrl = `${process.env.COGNITO_AUTH_CLIENT_DOMAIN}/oauth2/revoke`;
      const basicAuth = Buffer.from(
        `${process.env.COGNITO_AUTH_CLIENT_ID}:${process.env.COGNITO_AUTH_CLIENT_SECRET}`,
      ).toString('base64');
      const params = new URLSearchParams();
      params.append('token', refreshTokenModel.externalRefreshToken);
      params.append('client_id', `${process.env.COGNITO_AUTH_CLIENT_ID}`);
      fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': CONTENT_TYPE.JSON,
          Authorization: `Basic ${basicAuth}`,
        },
        body: params,
      })
        .then(() => {
          this.logger.info(
            `User ${refreshTokenModel.username} logged off successfully from cognito.`,
          );
        })
        .catch(err => {
          this.logger.error(
            `Error while logging off from cognito. Error :: ${err} ${JSON.stringify(
              err,
            )}`,
          );
        });
    }

    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokens.set(token, { token });
    await this.refreshTokenRepo.delete(req.refreshToken);
    if (refreshTokenModel.pubnubToken) {
      await this.refreshTokenRepo.delete(refreshTokenModel.pubnubToken);
    }

    return new SuccessResponse({
      success: true,

      key: refreshTokenModel.userId,
    });
  }
}

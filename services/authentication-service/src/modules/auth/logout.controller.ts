import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
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
} from '@sourceloop/core';
import {encode} from 'base-64';
import {authenticate, AuthErrorKeys, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {HttpsProxyAgent} from 'https-proxy-agent';
import * as fetch from 'node-fetch';
import {URLSearchParams} from 'url';

import {RefreshTokenRequest} from '../../models';
import {
  RefreshTokenRepository,
  RevokedTokenRepository,
} from '../../repositories';

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

const getProxyAgent = () => {
  if (proxyUrl) {
    return new HttpsProxyAgent(proxyUrl);
  }
  return undefined;
};

export class LogoutController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @repository(RevokedTokenRepository)
    private readonly revokedTokens: RevokedTokenRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @post('/logout', {
    security: OPERATION_SECURITY_SPEC,
    description: 'To logout',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': SuccessResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async logout(
    @param.header.string('Authorization', {
      description:
        'This is the access token which is required to authenticate user.',
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
    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokens.set(token, {token});
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
  @authorize({permissions: ['*']})
  @post('/keycloak/logout', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'This API will log out the user from application as well as keycloak',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': SuccessResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async keycloakLogout(
    @param.header.string('Authorization', {
      description:
        'This is the access token which is required to authenticate user.',
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
      fetch
        .default(logoutUrl, {
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
    await this.revokedTokens.set(token, {token});
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

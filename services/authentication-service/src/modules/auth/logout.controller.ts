// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
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
import {encode} from 'base-64';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {
  authenticate,
  AuthenticationBindings,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import fetch from 'node-fetch';
import {URLSearchParams} from 'url';
import {LoginActivity, RefreshTokenRequest} from '../../models';
import {
  LoginActivityRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {AuthServiceBindings} from '../../keys';
import {ActorId} from '../../types';
import crypto from 'crypto';
import {
  AuthClient,
  IUserActivity,
  JwtPayloadFn,
  LoginType,
  RefreshToken,
  User,
  UserTenant,
} from '../..';

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

const getProxyAgent = () => {
  if (proxyUrl) {
    return new HttpsProxyAgent(proxyUrl);
  }
  return undefined;
};

const size = 16;

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
    @inject(AuthServiceBindings.JWTPayloadProvider)
    private readonly getJwtPayload: JwtPayloadFn,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    private readonly client: AuthClient | undefined,
    @inject(AuthServiceBindings.MarkUserActivity, {optional: true})
    private readonly userActivity?: IUserActivity,
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
            schema: {[X_TS_TYPE]: SuccessResponse},
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

    //

    const user = await this.userRepo.findById(refreshTokenModel.userId);

    const userTenant = await this.userTenantRepo.findOne({
      where: {userId: user.id},
    });

    if (this.userActivity?.markUserActivity)
      this.markUserActivity(refreshTokenModel, user, userTenant);
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
            schema: {[X_TS_TYPE]: SuccessResponse},
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

  private markUserActivity(
    refreshTokenModel: RefreshToken,
    user: User,
    userTenant: UserTenant | null,
  ) {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (encryptionKey) {
      const iv = crypto.randomBytes(size);

      /* encryption of IP Address */
      const cipherIp = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
      const ip =
        this.ctx.request.headers['x-forwarded-for']?.toString() ??
        this.ctx.request.socket.remoteAddress?.toString() ??
        '';
      const encyptIp = Buffer.concat([
        cipherIp.update(ip, 'utf8'),
        cipherIp.final(),
      ]);
      const authTagIp = cipherIp.getAuthTag();
      const ipAddress = JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encyptIp.toString('hex'),
        authTag: authTagIp.toString('hex'),
      });

      /* encryption of Paylolad Address */

      const cipherPayload = crypto.createCipheriv(
        'aes-256-gcm',
        encryptionKey,
        iv,
      );
      const activityPayload = JSON.stringify({
        ...user,
        clientId: refreshTokenModel.clientId,
      });
      const encyptPayload = Buffer.concat([
        cipherPayload.update(activityPayload, 'utf8'),
        cipherPayload.final(),
      ]);
      const authTagPayload = cipherIp.getAuthTag();
      const tokenPayload = JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encyptPayload.toString('hex'),
        authTag: authTagPayload.toString('hex'),
      });
      let actor: string, tenantId;
      if (userTenant) {
        actor = userTenant[this.actorKey]?.toString() ?? '0';
        tenantId = userTenant.tenantId;
      } else {
        actor = user['id']?.toString() ?? '0';
        tenantId = user.defaultTenantId ?? '0';
      }

      const loginActivity = new LoginActivity({
        actor,
        tenantId,
        loginTime: new Date(),
        tokenPayload,
        deviceInfo: this.ctx.request.headers['user-agent']?.toString(),
        loginType: LoginType.LOGOUT,
        ipAddress,
      });
      this.loginActivityRepo.create(loginActivity).catch(() => {
        this.logger.error(
          `Failed to add the login activity => ${JSON.stringify(
            loginActivity,
          )}`,
        );
      });
    }
  }
}

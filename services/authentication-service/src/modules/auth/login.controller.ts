﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  SuccessResponse,
  UserStatus,
  X_TS_TYPE,
} from '@sourceloop/core';
import {randomBytes} from 'crypto';
import {
  authenticate,
  authenticateClient,
  AuthenticationBindings,
  AuthErrorKeys,
  ClientAuthCode,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import moment from 'moment-timezone';
import {ActorId, ExternalTokens} from '../../types';
import {AuthServiceBindings} from '../../keys';
import {ActiveUsers, AuthClient, RefreshToken, User} from '../../models';
import {
  AuthCodeBindings,
  AuthCodeGeneratorFn,
  CodeReaderFn,
  JwtPayloadFn,
  JWTSignerFn,
} from '../../providers';
import * as jwt from 'jsonwebtoken';
import {
  ActiveUsersRepository,
  AuthClientRepository,
  OtpCacheRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  RoleRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserLevelResourceRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {TenantConfigRepository} from '../../repositories/tenant-config.repository';
import {LoginHelperService} from '../../services';
import {
  AuthRefreshTokenRequest,
  AuthTokenRequest,
  CodeResponse,
  LoginRequest,
} from './';
import {AuthUser} from './models/auth-user.model';
import {ResetPassword} from './models/reset-password.dto';
import {TokenResponse} from './models/token-response.dto';

export class LoginController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    private readonly client: AuthClient | undefined,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @repository(RoleRepository)
    public roleRepo: RoleRepository,
    @repository(UserLevelPermissionRepository)
    public utPermsRepo: UserLevelPermissionRepository,
    @repository(UserLevelResourceRepository)
    public userResourcesRepository: UserLevelResourceRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @repository(RevokedTokenRepository)
    public revokedTokensRepo: RevokedTokenRepository,
    @repository(TenantConfigRepository)
    public tenantConfigRepo: TenantConfigRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(RestBindings.Http.REQUEST)
    private readonly req: Request,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthServiceBindings.JWTPayloadProvider)
    private readonly getJwtPayload: JwtPayloadFn,
    @inject('services.LoginHelperService')
    private readonly loginHelperService: LoginHelperService,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
    @inject(AuthCodeBindings.JWT_SIGNER)
    private readonly jwtSigner: JWTSignerFn<object>,
    @repository(ActiveUsersRepository)
    private readonly activeUserRepo: ActiveUsersRepository,
    @inject(AuthServiceBindings.ActorIdKey)
    private readonly actorKey: ActorId,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(STRATEGY.LOCAL)
  @authorize({permissions: ['*']})
  @post('/auth/login', {
    description:
      'Gets you the code that will be used for getting token (webapps)',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Auth Code that you can use to generate access and refresh tokens using the POST /auth/token API',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async login(
    @requestBody()
    req: LoginRequest,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient | undefined,
    @inject(AuthenticationBindings.CURRENT_USER)
    user: AuthUser | undefined,
  ): Promise<CodeResponse> {
    await this.loginHelperService.verifyClientUserLogin(req, client, user);

    try {
      if (!this.user || !this.client) {
        // Control should never reach here
        this.logger.error(
          `${AuthErrorKeys.ClientInvalid} :: Control should never reach here`,
        );
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      }
      const token = await this.getAuthCode(this.client, this.user);
      return {
        code: token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(STRATEGY.OAUTH2_RESOURCE_OWNER_GRANT)
  @authorize({permissions: ['*']})
  @post('/auth/login-token', {
    description:
      'Gets you refresh token and access token in one hit. (mobile app)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response Model',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async loginWithClientUser(
    @requestBody() req: LoginRequest,
  ): Promise<TokenResponse> {
    await this.loginHelperService.verifyClientUserLogin(
      req,
      this.client,
      this.user,
    );

    try {
      if (!this.user || !this.client) {
        // Control should never reach here
        this.logger.error(
          `${AuthErrorKeys.ClientInvalid} :: Control should never reach here`,
        );
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      }
      const payload: ClientAuthCode<User, typeof User.prototype.id> = {
        clientId: this.client.clientId,
        user: this.user,
      };

      if (
        payload.user?.id &&
        !(await this.userRepo.firstTimeUser(payload.user.id))
      ) {
        await this.userRepo.updateLastLogin(payload.user.id);
      }

      return await this.createJWT(payload, this.client);
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }

  @authorize({permissions: ['*']})
  @post('/auth/token', {
    description:
      'Send the code received from the POST /auth/login api and get refresh token and access token (webapps)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async getToken(
    @requestBody() req: AuthTokenRequest,
    @inject(AuthCodeBindings.CODEREADER_PROVIDER)
    codeReader: CodeReaderFn,
  ): Promise<TokenResponse> {
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: req.clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const code = await codeReader(req.code);
      const payload = jwt.verify(code, authClient.secret, {
        audience: req.clientId,
        issuer: process.env.JWT_ISSUER,
        algorithms: ['HS256'],
      }) as ClientAuthCode<User, typeof User.prototype.id>;

      if (payload.mfa) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.UserVerificationFailed);
      }

      if (
        payload.userId &&
        !(await this.userRepo.firstTimeUser(payload.userId))
      ) {
        await this.userRepo.updateLastLogin(payload.userId);
      }

      return await this.createJWT(payload, authClient);
    } catch (error) {
      this.logger.error(error);
      if (error.name === 'TokenExpiredError') {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.CodeExpired);
      } else if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }

  @authorize({permissions: ['*']})
  @post('/auth/token-refresh', {
    security: OPERATION_SECURITY_SPEC,
    description:
      'Gets you a new access and refresh token once your access token is expired',
    //(both mobile and web)
    responses: {
      [STATUS_CODE.OK]: {
        description: 'New Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async exchangeToken(
    @requestBody() req: AuthRefreshTokenRequest,
    @param.header.string('device_id') deviceId?: string,
    @param.header.string('Authorization') token?: string,
  ): Promise<TokenResponse> {
    const payload = await this.createTokenPayload(req, token);
    return this.createJWT(
      {
        clientId: payload.refreshPayload.clientId,
        userId: payload.refreshPayload.userId,
        externalAuthToken: payload.refreshPayload.externalAuthToken,
        externalRefreshToken: payload.refreshPayload.externalRefreshToken,
      },
      payload.authClient,
      payload.refreshPayload.tenantId,
    );
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: ['*']})
  @patch(`auth/change-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'If User password successfully changed.',
      },
    },
  })
  async resetPassword(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(ResetPassword, {partial: true}),
        },
      },
    })
    req: ResetPassword,
    @param.header.string('Authorization') auth: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<SuccessResponse> {
    const token = auth?.replace(/bearer /i, '');
    if (!token || !req.refreshToken) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }

    const refreshTokenModel = await this.refreshTokenRepo.get(req.refreshToken);
    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    if (
      refreshTokenModel.username !== req.username ||
      currentUser.username !== req.username
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    if (req.password && req.password.length <= 0) {
      throw new HttpErrors.BadRequest(AuthenticateErrorKeys.PasswordInvalid);
    }

    let changePasswordResponse: User;
    if (req.oldPassword) {
      changePasswordResponse = await this.userRepo.updatePassword(
        req.username,
        req.oldPassword,
        req.password,
      );
    } else {
      changePasswordResponse = await this.userRepo.changePassword(
        req.username,
        req.password,
      );
    }

    if (!changePasswordResponse) {
      throw new HttpErrors.UnprocessableEntity('Unable to set password !');
    }

    const userTenant = await this.userTenantRepo.findOne({
      where: {
        userId: changePasswordResponse.id,
        tenantId: currentUser.tenantId,
      },
    });
    if (!userTenant) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
    }

    if (userTenant.status && userTenant.status < UserStatus.ACTIVE) {
      await this.userRepo.userTenants(changePasswordResponse.id).patch({
        status: UserStatus.ACTIVE,
      });
    }
    await this.revokedTokensRepo.set(token, {token});
    await this.refreshTokenRepo.delete(req.refreshToken);
    return new SuccessResponse({
      success: true,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @get('/auth/me', {
    security: OPERATION_SECURITY_SPEC,
    description: 'To get the user details',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'User Object',
        content: {
          [CONTENT_TYPE.JSON]: AuthUser,
        },
      },
      ...ErrorCodes,
    },
  })
  async me(): Promise<AuthUser | undefined> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    delete this.user.deviceInfo;
    return new AuthUser(this.user);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @post('/auth/switch-token', {
    security: OPERATION_SECURITY_SPEC,
    description: 'To switch the access-token',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Switch access token with the tenant id provided.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async switchToken(
    @requestBody() req: AuthRefreshTokenRequest,
  ): Promise<TokenResponse> {
    if (!req.tenantId) {
      throw new HttpErrors.BadRequest('Tenant ID is required');
    }
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }

    const payload = await this.createTokenPayload(req);
    return this.createJWT(
      {
        clientId: payload.refreshPayload.clientId,
        user: this.user,
        externalAuthToken: payload.refreshPayload.externalAuthToken,
        externalRefreshToken: payload.refreshPayload.externalRefreshToken,
      },
      payload.authClient,
      req.tenantId,
    );
  }

  private async createTokenPayload(
    req: AuthRefreshTokenRequest,
    token?: string,
  ): Promise<AnyObject> {
    const refreshPayload: RefreshToken = await this.refreshTokenRepo.get(
      req.refreshToken,
    );
    if (!refreshPayload) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: refreshPayload.clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const accessToken = token?.split(' ')[1];
    if (!accessToken || refreshPayload.accessToken !== accessToken) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokensRepo.set(refreshPayload.accessToken, {
      token: refreshPayload.accessToken,
    });
    await this.refreshTokenRepo.delete(req.refreshToken);
    return {
      refreshPayload: refreshPayload,
      authClient: authClient,
    };
  }
  private async createJWT(
    payload: ClientAuthCode<User, typeof User.prototype.id> & ExternalTokens,
    authClient: AuthClient,
    tenantId?: string,
  ): Promise<TokenResponse> {
    try {
      const size = 32;
      const ms = 1000;
      let user: User | undefined;
      if (payload.user) {
        user = payload.user;
      } else if (payload.userId) {
        user = await this.userRepo.findById(payload.userId, {
          include: [
            {
              relation: 'defaultTenant',
            },
          ],
        });
        if (payload.externalAuthToken && payload.externalRefreshToken) {
          (user as AuthUser).externalAuthToken = payload.externalAuthToken;
          (user as AuthUser).externalRefreshToken =
            payload.externalRefreshToken;
        }
      } else {
        // Do nothing and move ahead
      }
      if (!user) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }
      const data: AnyObject = await this.getJwtPayload(
        user,
        authClient,
        tenantId,
      );
      const accessToken = await this.jwtSigner(data, {
        expiresIn: authClient.accessTokenExpiration,
      });
      const refreshToken: string = randomBytes(size).toString('hex');
      // Set refresh token into redis for later verification
      await this.refreshTokenRepo.set(
        refreshToken,
        {
          clientId: authClient.clientId,
          userId: user.id,
          username: user.username,
          accessToken,
          externalAuthToken: (user as AuthUser).externalAuthToken,
          externalRefreshToken: (user as AuthUser).externalRefreshToken,
          tenantId: data.tenantId,
        },
        {ttl: authClient.refreshTokenExpiration * ms},
      );

      // make an entry to mark the active user

      const actor = user[this.actorKey]?.toString() ?? '0';
      const activeUser = new ActiveUsers({
        actor,
        loginTime: new Date(),
        tenantId: data.tenantId,
        tokenPayload: {...data, clientId: authClient.clientId},
      });
      this.activeUserRepo.create(activeUser).catch(() => {
        console.error(
          `Failed to add the active user => ${JSON.stringify(activeUser)}`,
        );
      });

      return new TokenResponse({
        accessToken,
        refreshToken,
        expires: moment()
          .add(authClient.accessTokenExpiration, 's')
          .toDate()
          .getTime(),
      });
    } catch (error) {
      this.logger.error(error);
      if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {AnyObject, DataObject, Model, repository} from '@loopback/repository';
import {
  HttpErrors,
  get,
  getModelSchemaRef,
  oas,
  param,
  patch,
  post,
  requestBody,
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
import {
  AuthErrorKeys,
  AuthenticationBindings,
  ClientAuthCode,
  STRATEGY,
  authenticate,
  authenticateClient,
} from 'loopback4-authentication';
import {AuthorizeErrorKeys, authorize} from 'loopback4-authorization';
import {LoginType} from '../../../enums';
import {AuthClient, RefreshToken, User} from '../../../models';
import {
  AuthCodeBindings,
  AuthCodeGeneratorFn,
  UserValidationServiceBindings,
} from '../../../providers';
import {
  AuthClientRepository,
  OtpCacheRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  RoleRepository,
  TenantConfigRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserLevelResourceRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories';
import {IdpLoginService, LoginHelperService} from '../../../services';
import {UserValidationFn} from '../../../types';
import {
  AuthRefreshTokenRequest,
  AuthTokenRequest,
  AuthUser,
  LoginRequest,
  ResetPassword,
  TokenResponse,
} from '../models';
import {CodeResponse} from '../types';

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
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject('services.LoginHelperService')
    private readonly loginHelperService: LoginHelperService,
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
    @inject(UserValidationServiceBindings.VALIDATE_USER)
    private readonly userValidationProvider: UserValidationFn,
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
  @oas.deprecated()
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
        const time = Date.now();
        await this.userRepo.updateLastLogin(payload.user.id, time);
        payload.user.lastLogin = new Date(time);
      }

      return await this.idpLoginService.createJWT(
        payload,
        this.client,
        LoginType.ACCESS,
      );
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
  async getToken(@requestBody() req: AuthTokenRequest): Promise<TokenResponse> {
    return this.idpLoginService.generateToken(req);
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
    const signUpProvider =
      (
        await this.userCredsRepository.findOne({
          where: {userId: payload.refreshPayload.userId},
        })
      )?.authProvider ?? '';
    const isAuthenticated = await this.userValidationProvider(
      req,
      payload,
      signUpProvider,
      token,
    );

    if (isAuthenticated) {
      return this.idpLoginService.createJWT(
        {
          clientId: payload.refreshPayload.clientId,
          userId: payload.refreshPayload.userId,
          externalAuthToken: payload.refreshPayload.externalAuthToken,
          externalRefreshToken: payload.refreshPayload.externalRefreshToken,
        },
        payload.authClient,
        LoginType.RELOGIN,
        payload.refreshPayload.tenantId,
      );
    }
    throw new HttpErrors.Forbidden();
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
    const token = this._extractToken(auth);
    await this._validateResetPasswordRequest(req, token, currentUser);

    const changePassword = await this._handlePasswordChange(req);
    if (!currentUser.tenantId) {
      throw new HttpErrors.BadRequest('Tenant ID is required');
    }
    if (changePassword.id) {
      await this._verifyUserTenant(changePassword.id, currentUser.tenantId);
    }

    await this.revokedTokensRepo.set(token, {token});
    await this.refreshTokenRepo.delete(req.refreshToken);
    return new SuccessResponse({
      success: true,
    });
  }

  /**
   * The function `_extractToken` removes the "bearer " prefix from an authorization header and returns
   * the extracted token, throwing an error if the token is missing.
   * @param {string} authHeader - The `authHeader` parameter is a string that typically contains an
   * authorization token.
   * @returns the extracted token from the `authHeader` string after removing the "bearer " prefix.
   */
  private _extractToken(authHeader: string): string {
    const token = authHeader?.replace(/bearer /i, '');
    if (!token) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }
    return token;
  }

  /**
   * The _validateResetPasswordRequest function checks the validity of a reset password request.
   * @param {ResetPassword} req - The `req` parameter in the `_validateResetPasswordRequest` function
   * represents the request body for resetting a password. It likely contains information such as the
   * username, password, and refresh token needed to reset the password for a user.
   * @param {string} token - The `token` parameter in the `_validateResetPasswordRequest` function is a
   * string that is used to verify the validity of the reset password request. It is compared with the
   * access token stored in the refresh token to ensure that the request is authorized. If the
   * `accessToken` in the `refreshToken
   * @param {IAuthUserWithPermissions} currentUser - The `currentUser` parameter in the
   * `_validateResetPasswordRequest` function represents the currently authenticated user who is
   * attempting to reset their password. This parameter is of type `IAuthUserWithPermissions`, which
   * likely contains information about the user, such as their username, permissions, and other
   * relevant details needed for
   */
  private async _validateResetPasswordRequest(
    req: ResetPassword,
    token: string,
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    if (!req.refreshToken) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }

    const refreshToken = await this.refreshTokenRepo.get(req.refreshToken);
    if (refreshToken.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }

    if (
      refreshToken.username !== req.username ||
      currentUser.username !== req.username
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    if (!req.password || req.password.length <= 0) {
      throw new HttpErrors.BadRequest(AuthenticateErrorKeys.PasswordInvalid);
    }
  }

  /**
   * The function `_handlePasswordChange` asynchronously handles password changes for a user based on
   * the provided input.
   * @param {ResetPassword} req - ResetPassword object containing the following properties:
   * @returns The function `_handlePasswordChange` is returning a Promise that resolves to a `User`
   * object.
   */
  private async _handlePasswordChange(req: ResetPassword): Promise<User> {
    const user =
      req.oldPassword !== undefined
        ? await this.getPasswordResponse(
            req.username,
            req.password,
            req.oldPassword,
          )
        : await this.getPasswordResponse(req.username, req.password);

    if (!user) {
      throw new HttpErrors.UnprocessableEntity('Unable to set password !');
    }

    return user;
  }

  /**
   * The function `_verifyUserTenant` checks and updates the status of a user's tenant based on certain
   * conditions.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier
   * of a user in the system. It is used to identify a specific user within the application.
   * @param {string} tenantId - The `tenantId` parameter in the `_verifyUserTenant` function is a
   * string that represents the unique identifier of a specific tenant in the system. This parameter is
   * used to identify the tenant to which the user belongs and is being verified against.
   */
  private async _verifyUserTenant(
    userId: string,
    tenantId: string,
  ): Promise<void> {
    const userTenant = await this.userTenantRepo.findOne({
      where: {userId, tenantId},
    });

    if (!userTenant) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
    }

    if (userTenant.status && userTenant.status < UserStatus.ACTIVE) {
      await this.userRepo.userTenants(userId).patch({
        status: UserStatus.ACTIVE,
      });
    }
  }

  async getPasswordResponse(
    userName: string,
    password: string,
    prevPassword?: string,
  ): Promise<User<DataObject<Model>>> {
    if (prevPassword) {
      let oldPassword = prevPassword;
      let newPassword = password;
      if (process.env.PRIVATE_DECRYPTION_KEY) {
        const decryptedOldPassword =
          await this.userRepo.decryptPassword(oldPassword);
        const decryptedNewPassword =
          await this.userRepo.decryptPassword(password);
        oldPassword = decryptedOldPassword;
        newPassword = decryptedNewPassword;
      }
      return this.userRepo.updatePassword(userName, oldPassword, newPassword);
    } else {
      let newPassword = password;
      if (process.env.PRIVATE_DECRYPTION_KEY) {
        const decryptedPassword = await this.userRepo.decryptPassword(password);
        newPassword = decryptedPassword;
      }
      return this.userRepo.changePassword(userName, newPassword);
    }
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
    return this.idpLoginService.createJWT(
      {
        clientId: payload.refreshPayload.clientId,
        user: this.user,
        externalAuthToken: payload.refreshPayload.externalAuthToken,
        externalRefreshToken: payload.refreshPayload.externalRefreshToken,
      },
      payload.authClient,
      LoginType.RELOGIN,
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
}

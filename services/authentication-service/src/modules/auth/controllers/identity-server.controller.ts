import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  OPERATION_SECURITY_SPEC,
  RevokedTokenRepository,
  STATUS_CODE,
  SuccessResponse,
  X_TS_TYPE,
} from '@sourceloop/core';
import {
  authenticate,
  authenticateClient,
  AuthenticationBindings,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  AuthCodeBindings,
  AuthServiceBindings,
  CodeReaderFn,
  IUserActivity,
  LoginType,
  RefreshTokenRepository,
  RefreshTokenRequest,
  UserRepository,
  UserTenantRepository,
} from '../../..';
import {IdpLoginService} from '../../../services';
import {
  AuthTokenRequest,
  AuthUser,
  IdpAuthMethod,
  IdpAuthRequest,
  IdpConfiguration,
  TokenResponse,
} from '../models';

export class IdentityServerController {
  constructor(
    @inject(AuthCodeBindings.CODEREADER_PROVIDER)
    private readonly codeReader: CodeReaderFn,
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
    @repository(RevokedTokenRepository)
    private readonly revokedTokens: RevokedTokenRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @inject(AuthServiceBindings.MarkUserActivity, {optional: true})
    private readonly userActivity?: IUserActivity,
  ) { }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post('/connect/auth', {
    description: 'POST Call for idp login',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async connectAuth(
    @requestBody({
      content: {
        [CONTENT_TYPE.FORM_URLENCODED]: {
          schema: getModelSchemaRef(IdpAuthRequest),
        },
      },
    })
    idpAuthRequest: IdpAuthRequest,
  ): Promise<void> {
    switch (idpAuthRequest?.auth_method) {
      case IdpAuthMethod.COGNITO:
        await this.idpLoginService.loginViaCognito();
        break;
      case IdpAuthMethod.GOOGLE:
        await this.idpLoginService.loginViaGoogle();
        break;
      case IdpAuthMethod.SAML:
        await this.idpLoginService.loginViaSaml();
        break;
      case IdpAuthMethod.FACEBOOK:
        await this.idpLoginService.loginViaFacebook();
        break;
      case IdpAuthMethod.APPLE:
        await this.idpLoginService.loginViaApple();
        break;
      case IdpAuthMethod.AZURE:
        await this.idpLoginService.loginViaAzure();
        break;
      case IdpAuthMethod.INSTAGRAM:
        await this.idpLoginService.loginViaInstagram();
        break;
      case IdpAuthMethod.KEYCLOAK:
        await this.idpLoginService.loginViaKeycloak();
        break;
    }
  }

  @authorize({permissions: ['*']})
  @get('/.well-known/openid-configuration', {
    security: OPERATION_SECURITY_SPEC,
    description: 'To get the openid configuration',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'OpenId Configuration',
        content: {
          [CONTENT_TYPE.JSON]: IdpConfiguration,
        },
      },
      ...ErrorCodes,
    },
  })
  async getConfig(): Promise<void> {
    this.idpLoginService.getOpenIdConfiguration();
  }

  @authorize({permissions: ['*']})
  @post('/connect/token', {
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

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @get('/connect/userinfo', {
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
  @post('/connect/endsession', {
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

    const user = await this.userRepo.findById(refreshTokenModel.userId);

    const userTenant = await this.userTenantRepo.findOne({
      where: {userId: user.id},
    });

    if (this.userActivity?.markUserActivity)
      this.idpLoginService.markUserActivity(
        user,
        userTenant,
        {
          ...user,
          clientId: refreshTokenModel.clientId,
        },
        LoginType.LOGOUT,
      );
    return new SuccessResponse({
      success: true,

      key: refreshTokenModel.userId,
    });
  }
}

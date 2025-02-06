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
  CONTENT_TYPE,
  ErrorCodes,
  JwtKeysRepository,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  SuccessResponse,
  X_TS_TYPE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {JwtKeys} from '../../../models';
import {IdpLoginService} from '../../../services';
import {
  AuthRefreshTokenRequest,
  AuthTokenRequest,
  AuthUser,
  IdpConfiguration,
  TokenResponse,
} from '../models';

export class IdentityServerController {
  constructor(
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
    @repository(JwtKeysRepository)
    private jwtKeysRepository: JwtKeysRepository,
  ) {}

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
  async getConfig(): Promise<IdpConfiguration> {
    return this.idpLoginService.getOpenIdConfiguration();
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
          schema: getModelSchemaRef(AuthRefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: AuthRefreshTokenRequest,
  ): Promise<SuccessResponse> {
    return this.idpLoginService.logoutUser(auth, req);
  }

  @authorize({permissions: ['*']})
  @post('/connect/generate-keys', {
    description: 'Generate the set of public and private keys',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'JWKS Keys',
      },
      ...ErrorCodes,
    },
  })
  async generateKeys(): Promise<void> {
    return this.idpLoginService.generateKeys();
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @post('/connect/rotate-keys', {
    description: 'Generate the set of public and private keys',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'JWKS Keys',
      },
      ...ErrorCodes,
    },
  })
  async rotateKeys(): Promise<void> {
    return this.idpLoginService.generateNewKey();
  }

  @authorize({permissions: ['*']})
  @get('/connect/get-keys', {
    description: 'Get the public keys',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'JWKS Keys',
      },
      ...ErrorCodes,
    },
  })
  async getKeys(): Promise<JwtKeys[]> {
    return this.jwtKeysRepository.find({
      fields: {publicKey: true, id: true, keyId: true},
    });
  }
}

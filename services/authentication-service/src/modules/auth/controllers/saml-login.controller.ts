import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ILogger,
  LOGGER,
  STATUS_CODE,
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
import {AuthCodeBindings, AuthCodeGeneratorFn} from '../../../providers';
import {AuthClientRepository} from '../../../repositories';
import {IdpLoginService} from '../../../services';
import {AuthUser, ClientAuthRequest, TokenResponse} from '../models';

export class SamlLoginController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
    @inject('services.IdpLoginService')
    private readonly idpLoginService: IdpLoginService,
  ) { }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post('/auth/saml', {
    description: 'POST Call for saml based login',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Saml Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async postLoginViaSaml(
    @requestBody({
      content: {
        [CONTENT_TYPE.FORM_URLENCODED]: {
          schema: getModelSchemaRef(ClientAuthRequest),
        },
      },
    })
    clientCreds?: ClientAuthRequest, //NOSONAR
  ): Promise<void> {
    return this.idpLoginService.loginViaSaml();
  }

  @authenticate(STRATEGY.SAML, {
    accessType: 'offline',
    scope: ['profile', 'email'],
    issuer: process.env.SAML_ISSUER,
    callbackURL: process.env.SAML_CALLBACK_URL,
    cert: process.env.SAML_CERT,
    entryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.SAML_AUDIENCE,
    logoutUrl: process.env.SAML_LOGOUT_URL,
    passReqToCallback: !!+(process.env.SAML_AUTH_PASS_REQ_CALLBACK ?? 0),
    validateInResponseTo: !!+(process.env.VALIDATE_RESPONSE ?? 1),
    idpIssuer: process.env.IDP_ISSUER,
    logoutCallbackUrl: process.env.SAML_LOGOUT_CALLBACK_URL,
  })
  @authorize({permissions: ['*']})
  @post(`/auth/saml-redirect`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'okta auth callback',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async oktaSamlCallback(
    @inject(AuthenticationBindings.CURRENT_USER)
    user: AuthUser | undefined,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.query.string('client') clientId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody({
      content: {
        [CONTENT_TYPE.FORM_URLENCODED]: {},
      },
    })
    oktaData: AnyObject,
  ): Promise<void> {
    if (!clientId || !user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const client = await this.authClientRepository.findOne({
      where: {
        clientId,
      },
    });
    if (!client?.redirectUrl) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const token = await this.getAuthCode(client, user);
      response.redirect(`${client.redirectUrl}?code=${token}`);
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }
}

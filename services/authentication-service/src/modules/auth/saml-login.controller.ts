import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  Response,
  RestBindings,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ILogger,
  LOGGER,
  STATUS_CODE,
  X_TS_TYPE,
} from '@sourceloop/core';
import {
  AuthErrorKeys,
  AuthenticationBindings,
  STRATEGY,
  authenticate,
  authenticateClient,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {AuthCodeBindings} from '../../providers/keys';
import {AuthCodeGeneratorFn} from '../../providers/types';
import {AuthClientRepository} from '../../repositories';
import {AuthUser} from './models/auth-user.model';
import {ClientAuthRequest} from './models/client-auth-request.dto';
import {TokenResponse} from './models/token-response.dto';
export class SamlLoginController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(STRATEGY.SAML, {
    accessType: 'offline',
    scope: ['profile', 'email'],
    callbackURL: process.env.SAML_CALLBACK_URL,
    issuer: process.env.SAML_ISSUER,
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
    //do nothing
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

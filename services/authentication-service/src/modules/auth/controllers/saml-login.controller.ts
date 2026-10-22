import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {
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
  getModelSchemaRefSF,
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
import {
  CacheItem,
  CacheProvider,
  ValidateInResponseTo,
} from '@node-saml/passport-saml';
import {authorize} from 'loopback4-authorization';
import {AuthCodeBindings, AuthCodeGeneratorFn} from '../../../providers';
import {AuthClientRepository} from '../../../repositories';
import {AuthUser, ClientAuthRequest, TokenResponse} from '../models';

// Pending AuthnRequest IDs are dropped after this long, matching node-saml's own in-memory provider
const SAML_REQUEST_TTL_MS = 8 * 60 * 60 * 1000;
const samlRequests = new Map<string, CacheItem>();
// Closes over the Map rather than using this, since @authenticate deep-clones options
const samlRequestCache: CacheProvider = {
  saveAsync: (key, value) => {
    const now = Date.now();
    for (const [id, item] of samlRequests) {
      if (item.createdAt + SAML_REQUEST_TTL_MS > now) {
        break;
      }
      samlRequests.delete(id);
    }
    const item = {value, createdAt: now};
    samlRequests.set(key, item);
    return Promise.resolve(item);
  },
  getAsync: key => {
    const item = samlRequests.get(key);
    if (item && item.createdAt + SAML_REQUEST_TTL_MS <= Date.now()) {
      samlRequests.delete(key);
      return Promise.resolve(null);
    }
    return Promise.resolve(item?.value ?? null);
  },
  removeAsync: key =>
    Promise.resolve(key !== null && samlRequests.delete(key) ? key : null),
};

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
    callbackUrl: process.env.SAML_CALLBACK_URL,
    issuer: process.env.SAML_ISSUER,
    idpCert: process.env.SAML_CERT,
    entryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.SAML_AUDIENCE,
    logoutUrl: process.env.SAML_LOGOUT_URL,
    passReqToCallback: !!+(process.env.SAML_AUTH_PASS_REQ_CALLBACK ?? 0),
    validateInResponseTo: !!+(process.env.VALIDATE_RESPONSE ?? 0)
      ? ValidateInResponseTo.always
      : ValidateInResponseTo.never,
    cacheProvider: samlRequestCache,
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
          schema: getModelSchemaRefSF(ClientAuthRequest),
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
    callbackUrl: process.env.SAML_CALLBACK_URL,
    idpCert: process.env.SAML_CERT,
    entryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.SAML_AUDIENCE,
    logoutUrl: process.env.SAML_LOGOUT_URL,
    passReqToCallback: !!+(process.env.SAML_AUTH_PASS_REQ_CALLBACK ?? 0),
    validateInResponseTo: !!+(process.env.VALIDATE_RESPONSE ?? 0)
      ? ValidateInResponseTo.always
      : ValidateInResponseTo.never,
    cacheProvider: samlRequestCache,
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

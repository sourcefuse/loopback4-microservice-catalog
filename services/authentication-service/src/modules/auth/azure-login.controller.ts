import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  oas,
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
import {AuthCodeBindings, AuthCodeGeneratorFn} from '../../providers';
import {AuthClientRepository} from '../../repositories';
import {AuthUser} from './models/auth-user.model';
import {ClientAuthRequest} from './models/client-auth-request.dto';
import {TokenResponse} from './models/token-response.dto';

const queryGen = (from: 'body' | 'query') => {
  return (req: Request) => {
    return {
      customState: `client_id=${req[from].client_id}`,
    };
  };
};
const offSet = 10;
const clockSkew = 300;
const nonceTime = 3600;
const nonceCount = 10;
export class AzureLoginController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.AZURE_AD,
    {
      scope: ['profile', 'email', 'openid', 'offline_access'],
      identityMetadata: process.env.AZURE_IDENTITY_METADATA,
      clientID: process.env.AZURE_AUTH_CLIENT_ID,
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: process.env.AZURE_AUTH_REDIRECT_URL,
      clientSecret: process.env.AZURE_AUTH_CLIENT_SECRET,
      allowHttpForRedirectUrl: !!+(
        process.env.AZURE_AUTH_ALLOW_HTTP_REDIRECT ?? 1
      ),
      passReqToCallback: !!+(process.env.AZURE_AUTH_PASS_REQ_CALLBACK ?? 0),
      validateIssuer: !!+(process.env.AZURE_AUTH_VALIDATE_ISSUER ?? 1),
      useCookieInsteadOfSession: !!+(
        process.env.AZURE_AUTH_COOKIE_INSTEAD_SESSION ?? 1
      ),
      cookieEncryptionKeys: [
        {
          key: process.env.AZURE_AUTH_COOKIE_KEY,
          iv: process.env.AZURE_AUTH_COOKIE_IV,
        },
      ],
      isB2c: !!+(process.env.AZURE_AUTH_B2C_TENANT ?? 0),
      clockSkew: +(process.env.AZURE_AUTH_CLOCK_SKEW ?? clockSkew),
      loggingLevel: process.env.AZURE_AUTH_LOG_LEVEL,
      loggingNoPII: !!+(process.env.AZURE_AUTH_LOG_PII ?? 1),
      nonceLifetime: +(process.env.AZURE_AUTH_NONCE_TIME ?? nonceTime),
      nonceMaxAmount: +(process.env.AZURE_AUTH_NONCE_COUNT ?? nonceCount),
      issuer: process.env.AZURE_AUTH_ISSUER,
      cookieSameSite: !!+(process.env.AZURE_AUTH_COOKIE_SAME_SITE ?? 0),
    },
    queryGen('query'),
  )
  @authorize({permissions: ['*']})
  @oas.deprecated()
  @get('/auth/azure', {
    description: 'POST Call for azure based login',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Azure Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async getLoginViaAzure(
    @param.query.string('client_id')
    clientId?: string, //NOSONAR
    @param.query.string('client_secret')
    clientSecret?: string, //NOSONAR
  ): Promise<void> {
    //do nothing
  }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.AZURE_AD,
    {
      scope: ['profile', 'email', 'openid', 'offline_access'],
      identityMetadata: process.env.AZURE_IDENTITY_METADATA,
      clientID: process.env.AZURE_AUTH_CLIENT_ID,
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: process.env.AZURE_AUTH_REDIRECT_URL,
      clientSecret: process.env.AZURE_AUTH_CLIENT_SECRET,
      allowHttpForRedirectUrl: !!+(
        process.env.AZURE_AUTH_ALLOW_HTTP_REDIRECT ?? 1
      ),
      passReqToCallback: !!+(process.env.AZURE_AUTH_PASS_REQ_CALLBACK ?? 0),
      validateIssuer: !!+(process.env.AZURE_AUTH_VALIDATE_ISSUER ?? 1),
      useCookieInsteadOfSession: !!+(
        process.env.AZURE_AUTH_COOKIE_INSTEAD_SESSION ?? 1
      ),
      cookieEncryptionKeys: [
        {
          key: process.env.AZURE_AUTH_COOKIE_KEY,
          iv: process.env.AZURE_AUTH_COOKIE_IV,
        },
      ],
      isB2c: !!+(process.env.AZURE_AUTH_B2C_TENANT ?? 0),
      clockSkew: +(process.env.AZURE_AUTH_CLOCK_SKEW ?? clockSkew),
      loggingLevel: process.env.AZURE_AUTH_LOG_LEVEL,
      loggingNoPII: !!+(process.env.AZURE_AUTH_LOG_PII ?? 1),
      nonceLifetime: +(process.env.AZURE_AUTH_NONCE_TIME ?? nonceTime),
      nonceMaxAmount: +(process.env.AZURE_AUTH_NONCE_COUNT ?? nonceCount),
      issuer: process.env.AZURE_AUTH_ISSUER,
      cookieSameSite: !!+(process.env.AZURE_AUTH_COOKIE_SAME_SITE ?? 0),
    },
    queryGen('body'),
  )
  @authorize({permissions: ['*']})
  @post('/auth/azure', {
    description: 'POST Call for azure based login',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Azure Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async postLoginViaAzure(
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

  @authenticate(
    STRATEGY.AZURE_AD,
    {
      scope: ['profile', 'email', 'openid', 'offline_access'],
      identityMetadata: process.env.AZURE_IDENTITY_METADATA,
      clientID: process.env.AZURE_AUTH_CLIENT_ID,
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: process.env.AZURE_AUTH_REDIRECT_URL,
      clientSecret: process.env.AZURE_AUTH_CLIENT_SECRET,
      allowHttpForRedirectUrl: !!+(
        process.env.AZURE_AUTH_ALLOW_HTTP_REDIRECT ?? 1
      ),
      passReqToCallback: !!+(process.env.AZURE_AUTH_PASS_REQ_CALLBACK ?? 0),
      validateIssuer: !!+(process.env.AZURE_AUTH_VALIDATE_ISSUER ?? 1),
      useCookieInsteadOfSession: !!+(
        process.env.AZURE_AUTH_COOKIE_INSTEAD_SESSION ?? 1
      ),
      cookieEncryptionKeys: [
        {
          key: process.env.AZURE_AUTH_COOKIE_KEY,
          iv: process.env.AZURE_AUTH_COOKIE_IV,
        },
      ],
      isB2c: !!+(process.env.AZURE_AUTH_B2C_TENANT ?? 0),
      clockSkew: +(process.env.AZURE_AUTH_CLOCK_SKEW ?? clockSkew),
      loggingLevel: process.env.AZURE_AUTH_LOG_LEVEL,
      loggingNoPII: !!+(process.env.AZURE_AUTH_LOG_PII ?? 1),
      nonceLifetime: +(process.env.AZURE_AUTH_NONCE_TIME ?? nonceTime),
      nonceMaxAmount: +(process.env.AZURE_AUTH_NONCE_COUNT ?? nonceCount),
      issuer: process.env.AZURE_AUTH_ISSUER,
      cookieSameSite: !!+(process.env.AZURE_AUTH_COOKIE_SAME_SITE ?? 0),
    },
    queryGen('query'),
  )
  @authorize({permissions: ['*']})
  @get('/auth/azure-oauth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Azure Redirect Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async azureCallback(
    @param.query.string('code') code: string, //NOSONAR
    @param.query.string('state') state: string,
    @param.query.string('session_state') sessionState: string, //NOSONAR
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    user: AuthUser | undefined,
  ): Promise<void> {
    const clientId = state.substring(state.indexOf('client_id=') + offSet);

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
      const role = user.role;
      response.redirect(
        `${process.env.WEBAPP_URL ?? ''}${
          client.redirectUrl
        }?code=${token}&role=${role}`,
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }
}

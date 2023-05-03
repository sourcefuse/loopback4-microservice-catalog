// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
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
import {URLSearchParams} from 'url';
import {AuthCodeBindings, AuthCodeGeneratorFn} from '../../providers';
import {AuthClientRepository} from '../../repositories';
import {AuthUser} from './models/auth-user.model';
import {ClientAuthRequest} from './models/client-auth-request.dto';
import {TokenResponse} from './models/token-response.dto';

const queryGen = (from: 'body' | 'query') => {
  return (req: Request) => {
    return {
      state: `client_id=${req[from].client_id}`,
    };
  };
};

export class KeycloakLoginController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    private readonly getAuthCode: AuthCodeGeneratorFn,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
      //'http://localhost:3001/auth/keycloak-auth-redirect',
      authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    },
    queryGen('body'),
  )
  @authorize({permissions: ['*']})
  @post('/auth/keycloak', {
    description: 'POST Call for keycloak based login',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Keycloak Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async postLoginViaKeycloak(
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

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
      //'http://localhost:3001/auth/keycloak-auth-redirect',
      authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    },
    queryGen('query'),
  )
  @authorize({permissions: ['*']})
  @oas.deprecated()
  @get('/auth/keycloak', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Keycloak Token Response',
        // (Deprecated: Possible security issue
        //if secret is passed via query params, please use the post endpoint)
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async loginViaKeycloak(
    @param.query.string('client_id')
    clientId?: string, //NOSONAR
    @param.query.string('client_secret')
    clientSecret?: string, //NOSONAR
  ): Promise<void> {
    //do nothing
  }

  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
      //'http://localhost:3001/auth/keycloak-auth-redirect',
      authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    },
    queryGen('query'),
  )
  @authorize({permissions: ['*']})
  @get('/auth/keycloak-auth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Keycloak Redirect Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {[X_TS_TYPE]: TokenResponse},
          },
        },
      },
    },
  })
  async keycloakCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    user: AuthUser | undefined,
  ): Promise<void> {
    const clientId = new URLSearchParams(state).get('client_id');
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

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
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {
  authenticate,
  authenticateClient,
  AuthenticationBindings,
  AuthErrorKeys,
  ClientAuthCode,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {URLSearchParams} from 'url';

import {User} from '../../models';
import {AuthCodeBindings, CodeWriterFn} from '../../providers';
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
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET, //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL, //'http://localhost:3001/auth/keycloak-auth-redirect',
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
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async postLoginViaKeycloak(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: getModelSchemaRef(ClientAuthRequest),
        },
      },
    })
    clientCreds?: ClientAuthRequest,
  ): Promise<void> {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET, //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL, //'http://localhost:3001/auth/keycloak-auth-redirect',
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
        description:
          'Keycloak Token Response (Deprecated: Possible security issue if secret is passed via query params, please use the post endpoint)',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async loginViaKeycloak(
    @param.query.string('client_id')
    clientId?: string,
    @param.query.string('client_secret')
    clientSecret?: string,
  ): Promise<void> {}

  @authenticate(
    STRATEGY.KEYCLOAK,
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM, //'Tenant1',
      clientID: process.env.KEYCLOAK_CLIENT_ID, //'onboarding',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET, //'e607fd75-adc8-4af7-9f03-c9e79a4b8b72',
      callbackURL: process.env.KEYCLOAK_CALLBACK_URL, //'http://localhost:3001/auth/keycloak-auth-redirect',
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
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async keycloakCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthCodeBindings.CODEWRITER_PROVIDER)
    keycloackCodeWriter: CodeWriterFn,
  ): Promise<void> {
    const clientId = new URLSearchParams(state).get('client_id');
    if (!clientId || !this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    const client = await this.authClientRepository.findOne({
      where: {
        clientId,
      },
    });
    if (!client || !client.redirectUrl) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const codePayload: ClientAuthCode<User, typeof User.prototype.id> = {
        clientId,
        user: this.user,
      };
      const token = await keycloackCodeWriter(
        jwt.sign(codePayload, client.secret, {
          expiresIn: client.authCodeExpiration,
          audience: clientId,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        }),
      );
      response.redirect(`${client.redirectUrl}?code=${token}`);
    } catch (error) {
      this.logger.error(error);
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }
}

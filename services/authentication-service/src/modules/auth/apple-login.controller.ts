import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
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

export class AppleLoginController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(
    STRATEGY.APPLE_OAUTH2,
    {
      accessType: 'offline',
      scope: ['name', 'email'],
      callbackURL: process.env.APPLE_AUTH_CALLBACK_URL,
      clientID: process.env.APPLE_AUTH_CLIENT_ID,
      teamID: process.env.APPLE_AUTH_TEAM_ID,
      keyID: process.env.APPLE_AUTH_KEY_ID,
      privateKeyLocation: process.env.APPLE_AUTH_PRIVATE_KEY_LOCATION,
    },
    queryGen('body'),
  )
  @authorize({permissions: ['*']})
  @post('/auth/oauth-apple', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'POST Call for Apple based login',
        content: {},
      },
    },
  })
  postLoginViaApple(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: getModelSchemaRef(ClientAuthRequest),
        },
      },
    })
    clientCreds: ClientAuthRequest,
  ): void {}

  @authenticate(
    STRATEGY.APPLE_OAUTH2,
    {
      accessType: 'offline',
      scope: ['name', 'email'],
      callbackURL: process.env.APPLE_AUTH_CALLBACK_URL,
      clientID: process.env.APPLE_AUTH_CLIENT_ID,
      teamID: process.env.APPLE_AUTH_TEAM_ID,
      keyID: process.env.APPLE_AUTH_KEY_ID,
      privateKeyLocation: process.env.APPLE_AUTH_PRIVATE_KEY_LOCATION,
    },
    queryGen('query'),
  )
  @authorize({permissions: ['*']})
  @get('/auth/apple-oauth-redirect', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Apple Redirect Token Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': TokenResponse},
          },
        },
      },
    },
  })
  async appleCallback(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthCodeBindings.CODEWRITER_PROVIDER)
    appleCodeWriter: CodeWriterFn,
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
      const token = await appleCodeWriter(
        jwt.sign(codePayload, client.secret, {
          expiresIn: client.authCodeExpiration,
          audience: clientId,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        }),
      );
      const role = this.user.role;
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

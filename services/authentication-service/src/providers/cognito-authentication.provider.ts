import {Provider, inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {CONTENT_TYPE, ILogger, LOGGER} from '@sourceloop/core';
import crypto from 'crypto';
import fetch from 'node-fetch';
import {AuthenticationProviderFn} from '..';
import {AuthRefreshTokenRequest} from '../modules/auth';
import {RefreshTokenRepository} from '../repositories';

export class CognitoAuthenticationProvider implements Provider<AuthenticationProviderFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
  ) {}
  value(): AuthenticationProviderFn {
    return async (
      refreshToken: string,
      req?: AuthRefreshTokenRequest,
      payload?: AnyObject,
    ) => {
      if (!req || !payload) {
        throw new Error('Payload information not provided');
      }
      return this.isAuthenticated(refreshToken, req, payload);
    };
  }
  async isAuthenticated(
    refreshToken: string,
    req: AuthRefreshTokenRequest,
    payload: AnyObject,
  ) {
    let isAuthenticated = true;
    const cognitoUrl = `${process.env.COGNITO_AUTH_CLIENT_DOMAIN}/oauth2/token`;
    const clientId = `${process.env.COGNITO_AUTH_CLIENT_ID}`;
    const clientSecret = `${process.env.COGNITO_AUTH_CLIENT_SECRET}`;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );
    const requestBody = `grant_type=refresh_token&client_id=${clientId}&refresh_token=${refreshToken}`;
    const refreshPayload = payload.refreshPayload;
    fetch(cognitoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': CONTENT_TYPE.JSON,
        Authorization: `Basic ${basicAuth}`,
      },
      body: requestBody,
    })
      .then(response => response.json())
      .then(data => {
        refreshPayload.externalRefreshToken = data['refresh_token'];
      })
      .catch(error => {
        isAuthenticated = false;
        this.logger.error(
          `Error while generating access token. Error :: ${error} ${JSON.stringify(
            error,
          )}`,
        );
        return isAuthenticated;
      });
    const refreshTokenKey: string = crypto.randomBytes(32).toString('hex');
    await this.refreshTokenRepo.set(refreshTokenKey, refreshPayload, {
      ttl: payload.authClient.refreshTokenExpiration * 1000,
    });
    return isAuthenticated;
  }
}

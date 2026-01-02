import {Provider, inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {CONTENT_TYPE, ILogger, LOGGER} from '@sourceloop/core';
import crypto from 'crypto';
import fetch from 'node-fetch';
import {AuthenticationProviderFn} from '..';
import {AuthRefreshTokenRequest} from '../modules/auth';
import {RefreshTokenRepository} from '../repositories';

export class AzureAuthenticationProvider implements Provider<AuthenticationProviderFn> {
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
    const url = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
    const clientId = process.env.AZURE_AUTH_CLIENT_ID;
    const grantType = 'refresh_token';
    const clientSecret = process.env.AZURE_AUTH_CLIENT_SECRET; // NOTE: Only applicable for web apps
    const requestBody = `client_id=${clientId}&refresh_token=${refreshToken}&grant_type=${grantType}&client_secret=${clientSecret}`;
    const refreshPayload = payload.refreshPayload;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': CONTENT_TYPE.JSON,
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

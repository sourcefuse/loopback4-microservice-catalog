import {Provider, inject} from '@loopback/context';
import {CONTENT_TYPE, ILogger, LOGGER} from '@sourceloop/core';
import {encode} from 'base-64';
import fetch from 'node-fetch';
import {AuthenticationProviderFn} from '..';

export class KeycloakAuthenticationProvider implements Provider<AuthenticationProviderFn> {
  constructor(@inject(LOGGER.LOGGER_INJECT) public logger: ILogger) {}
  value(): AuthenticationProviderFn {
    return async (accessToken: string) => this.isAuthenticated(accessToken);
  }
  isAuthenticated(accessToken: string) {
    let isAuthenticated = true;
    const params = new URLSearchParams();
    const strToEncode = `${process.env.KEYCLOAK_CLIENT_ID}:${process.env.KEYCLOAK_CLIENT_SECRET}`;
    const keycloakApiUrl = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token/introspect`;

    params.append('token', accessToken);
    // Using fetch to make the API call
    fetch(keycloakApiUrl, {
      method: 'post',
      headers: {
        'Content-Type': CONTENT_TYPE.JSON,
        Authorization: `Basic ${encode(strToEncode)}`, // Base64 encode client ID and client secret
        Accept: 'application/json',
      },
      body: params,
    })
      .then(response => {
        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        return response.json();
      })
      .then(data => {
        if ('active' in data && data.active === false) {
          isAuthenticated = false;
        }
      })
      .catch(error => {
        this.logger.error(
          `Error while logging off from keycloak. Error :: ${error} ${JSON.stringify(
            error,
          )}`,
        );
      });

    return isAuthenticated;
  }
}

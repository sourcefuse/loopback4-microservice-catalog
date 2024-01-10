import {Provider, inject} from '@loopback/context';
import {ILogger, LOGGER} from '@sourceloop/core';
import fetch from 'node-fetch';
import {AuthenticationProviderFn} from '..';

export class GoogleAuthenticationProvider
  implements Provider<AuthenticationProviderFn>
{
  constructor(@inject(LOGGER.LOGGER_INJECT) public logger: ILogger) {}
  value(): AuthenticationProviderFn {
    return async (accessToken: string) => this.isAuthenticated(accessToken);
  }
  isAuthenticated(accessToken: string) {
    let isAuthenticated = true;
    const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;
    // Using fetch to make the API call
    fetch(googleApiUrl, {
      method: 'post',
    })
      .then(response => {
        // Check if the response status is OK (200)
        if (!response.ok) {
          isAuthenticated = false;
          this.logger.info(
            `User is not authenticated to use the application furter.`,
          );
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse the JSON response
        return response.json();
      })
      .then(data => {
        if (!('aud' in data) || data.aud !== process.env.GOOGLE_CLIENT_ID) {
          isAuthenticated = false;
        }
      })
      .catch(error => {
        this.logger.error(
          `Error while logging off from google. Error :: ${error} ${JSON.stringify(
            error,
          )}`,
        );
      });
    return isAuthenticated;
  }
}

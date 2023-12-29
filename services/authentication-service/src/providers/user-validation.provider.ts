import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  GoogleAuthenticationProviderFn,
  KeycloakAuthenticationProviderFn,
  UserValidationFn,
  UserValidationServiceBindings,
} from '..';
import {SignUpProviderKey} from '../enums/sign-up-provider.enum';
import {AuthRefreshTokenRequest} from '../modules/auth';

@injectable({scope: BindingScope.TRANSIENT})
export class UserValidationProvider implements Provider<UserValidationFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(UserValidationServiceBindings.GOOGLE_AUTHENTICATION)
    private googleAuthenticationProvider: GoogleAuthenticationProviderFn,
    @inject(UserValidationServiceBindings.KEYCLOAK_AUTHENTICATION)
    private keycloakAuthenticationProvider: KeycloakAuthenticationProviderFn,
  ) {}

  value(): UserValidationFn {
    return async (
      req: AuthRefreshTokenRequest,
      payload: AnyObject,
      signUpProvider: string,
      token?: string,
    ) => this.isAuthenticated(payload, signUpProvider, token);
  }
  async isAuthenticated(
    payload: AnyObject,
    signUpProvider?: string,
    token?: string,
  ) {
    let isAuthenticated = true;
    const accessToken = payload.refreshPayload.externalAuthToken;
    switch (signUpProvider) {
      case SignUpProviderKey.Google:
        isAuthenticated = await this.googleAuthenticationProvider(accessToken);
        break;
      case SignUpProviderKey.Keycloak:
        isAuthenticated =
          await this.keycloakAuthenticationProvider(accessToken);
        break;

      // If none of the cases apply, the default case will set isAuthenticated to true
    }
    return isAuthenticated;
  }
}

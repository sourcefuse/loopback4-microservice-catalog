import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationProviderFn, UserValidationFn} from '..';
import {SignUpProviderKey} from '../enums/sign-up-provider.enum';
import {AuthRefreshTokenRequest} from '../modules/auth';
import {UserValidationServiceBindings} from './keys';

@injectable({scope: BindingScope.TRANSIENT})
export class UserValidationProvider implements Provider<UserValidationFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(UserValidationServiceBindings.GOOGLE_AUTHENTICATION)
    private readonly googleAuthenticationProvider: AuthenticationProviderFn,
    @inject(UserValidationServiceBindings.KEYCLOAK_AUTHENTICATION)
    private readonly keycloakAuthenticationProvider: AuthenticationProviderFn,
    @inject(UserValidationServiceBindings.AZURE_AD_AUTHENTICATION)
    private readonly azureAuthenticationProvider: AuthenticationProviderFn,
    @inject(UserValidationServiceBindings.COGNITO_AUTHENTICATION)
    private readonly cognitoAuthenticationProvider: AuthenticationProviderFn,
    @inject(UserValidationServiceBindings.DEFAULT_AUTHENTICATION)
    private readonly defaultAuthneticationProvider: AuthenticationProviderFn,
  ) {}

  value(): UserValidationFn {
    return async (
      req: AuthRefreshTokenRequest,
      payload: AnyObject,
      signUpProvider: string,
      token?: string,
    ) => this.isAuthenticated(payload, req, signUpProvider, token);
  }
  async isAuthenticated(
    payload: AnyObject,
    req: AuthRefreshTokenRequest,
    signUpProvider?: string,
    token?: string,
  ) {
    let isAuthenticated = true;
    const accessToken = payload.refreshPayload.externalAuthToken;
    const refreshToken = payload.refreshPayload.externalRefreshToken;
    switch (signUpProvider) {
      case SignUpProviderKey.Google:
        isAuthenticated = await this.googleAuthenticationProvider(
          accessToken,
          req,
          payload,
        );
        break;
      case SignUpProviderKey.Keycloak:
        isAuthenticated = await this.keycloakAuthenticationProvider(
          accessToken,
          req,
          payload,
        );
        break;
      case SignUpProviderKey.Azure:
        isAuthenticated = await this.azureAuthenticationProvider(
          refreshToken,
          req,
          payload,
        );
        break;
      case SignUpProviderKey.Cognito:
        isAuthenticated = await this.cognitoAuthenticationProvider(
          refreshToken,
          req,
          payload,
        );
        break;
      default:
        isAuthenticated = await this.defaultAuthneticationProvider(
          accessToken,
          req,
          payload,
        );
      // If none of the cases apply, the default case will set isAuthenticated to true
    }
    return isAuthenticated;
  }
}

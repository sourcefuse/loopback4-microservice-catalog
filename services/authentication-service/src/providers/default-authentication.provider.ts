import {Provider, inject} from '@loopback/context';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationProviderFn} from '..';

export class DeafultAuthenticationProvider implements Provider<AuthenticationProviderFn> {
  constructor(@inject(LOGGER.LOGGER_INJECT) public logger: ILogger) {}
  value(): AuthenticationProviderFn {
    return async (accessToken: string) => this.isAuthenticated(accessToken);
  }
  isAuthenticated(accessToken: string) {
    return true;
  }
}

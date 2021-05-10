import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {IAuthUser} from 'loopback4-authentication';

import {AuthServiceDataSource} from '../datasources';
import {BearerVerifierBindings, BearerVerifierConfig} from '../keys';

export interface AuthenticationService {
  getme(token?: string): Promise<IAuthUser>;
}

export class AuthenticationServiceProvider
  implements Provider<AuthenticationService>
{
  constructor(
    @inject(BearerVerifierBindings.Config)
    conf: BearerVerifierConfig,
    // auth must match the name property in the datasource json file
    @inject('datasources.AuthService')
    protected dataSource: AuthServiceDataSource = new AuthServiceDataSource(
      conf,
    ),
  ) {}

  value(): Promise<AuthenticationService> {
    return getService(this.dataSource);
  }
}

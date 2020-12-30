import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './auth-service.datasource.json';
import {BearerVerifierBindings, BearerVerifierConfig} from '../keys';

export class AuthServiceDataSource extends juggler.DataSource {
  static dataSourceName = 'AuthService';

  constructor(
    @inject(BearerVerifierBindings.Config)
    conf: BearerVerifierConfig,
    @inject('datasources.config.AuthService', {optional: true})
    dsConfig: object = config,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (dsConfig as any).options.baseUrl = conf.authServiceUrl;
    super(dsConfig);
  }
}

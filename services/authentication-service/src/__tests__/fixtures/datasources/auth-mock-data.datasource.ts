import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './auth-mock-data.datasource.json';

export class AuthMockDataDataSource extends juggler.DataSource {
  static dataSourceName = 'AuthDB';

  constructor(
    @inject('datasources.config.AuthDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

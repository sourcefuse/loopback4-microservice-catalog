import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'authMockData',
  connector: 'memory',
  localStorage: '',
  file: '',
};

export class AuthMockDataDataSource extends juggler.DataSource {
  static dataSourceName = 'AuthDB';

  constructor(
    @inject('datasources.config.AuthDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

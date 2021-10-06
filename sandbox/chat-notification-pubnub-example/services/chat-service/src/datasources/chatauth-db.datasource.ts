import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';

const config = {
  name: AuthDbSourceName,
  connector: 'postgresql',
  url: '',
  host: process.env.AUTH_DB_HOST,
  port: process.env.AUTH_DB_PORT,
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASSWORD,
  database: process.env.AUTH_DB_DATABASE,
  schema: 'main'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ChatauthDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = AuthDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.chatauthDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

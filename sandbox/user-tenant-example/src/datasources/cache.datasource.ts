import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthCacheSourceName} from '@sourceloop/authentication-service';

const config = {
  name: AuthCacheSourceName,
  connector: 'kv-redis',
  // url: '',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  // schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class AuthenticationDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = config;

  constructor(
    // You need to set datasource configuration name
    // as 'datasources.config.Authentication' otherwise you might get Errors
    @inject('datasources.config.authentication', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

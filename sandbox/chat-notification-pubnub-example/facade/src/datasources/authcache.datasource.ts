import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthCacheSourceName} from '@sourceloop/authentication-service';

const config = {
  name: AuthCacheSourceName,
  connector: 'kv-redis',
  url: '',
  host: process.env.AUTH_DB_HOST,
  port: process.env.AUTH_DB_PORT,
  password: process.env.AUTH_DB_PASSWORD,
  db: process.env.AUTH_DB_DATABASE,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthcacheDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.authcache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

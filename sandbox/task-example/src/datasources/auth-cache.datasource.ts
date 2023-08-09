import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
// @ts-ignore
import {AuthCacheSourceName} from '@sourceloop/task-service';

const config = {
  name: AuthCacheSourceName,
  connector: 'kv-redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DATABASE,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthCacheDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'authCache';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.authCache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

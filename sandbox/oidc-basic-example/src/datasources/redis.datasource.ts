import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthCacheSourceName} from '@sourceloop/oidc-service';

const config = {
  name: 'redis',
  connector: 'kv-memory',
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD,
  // db: process.env.REDIS_DATABASE,
  // url: 'redis://localhost/',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RedisDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = {};

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

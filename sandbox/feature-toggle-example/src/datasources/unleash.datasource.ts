import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import FeatureToggleDbName from '@sourceloop/feature-toggle-service';

const config = {
  name: FeatureToggleDbName,
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UnleashDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = FeatureToggleDbName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.unleash', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

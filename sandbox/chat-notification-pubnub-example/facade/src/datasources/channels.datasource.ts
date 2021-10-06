import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'channels',
  connector: 'postgresql',
  url: '',
  host: process.env.CHANNEL_DB_HOST,
  port: process.env.CHANNEL_DB_PORT,
  user: process.env.CHANNEL_DB_USER,
  password: process.env.CHANNEL_DB_PASSWORD,
  database: process.env.CHANNEL_DB_DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ChannelsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'channels';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.channels', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

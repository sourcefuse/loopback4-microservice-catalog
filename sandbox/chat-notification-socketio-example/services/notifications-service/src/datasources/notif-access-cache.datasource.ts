// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'NotifAccessCache',
  connector: 'kv-redis',
  // url: '',
  host: process.env.NOTIFCACHE_DB_HOST,
  port: process.env.NOTIFCACHE_DB_PORT,
  password: process.env.NOTIFCACHE_DB_PASSWORD,
  db: process.env.NOTIFCACHE_DB_DATABASE,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotifAccessCacheDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'NotifAccessCache';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.NotifAccessCache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

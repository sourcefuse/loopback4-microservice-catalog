// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {NotifDbSourceName} from '@sourceloop/notification-service';

const config = {
  name: NotifDbSourceName,
  connector: 'postgresql',
  // url: '',
  host: process.env.NOTIF_DB_HOST,
  port: process.env.NOTIF_DB_PORT,
  user: process.env.NOTIF_DB_USER,
  password: process.env.NOTIF_DB_PASSWORD,
  database: process.env.NOTIF_DB_DATABASE,
  schema: 'main',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotifdbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = NotifDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notifdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

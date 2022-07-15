// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './message.datasource.config.json';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MessageDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'message';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.message', {optional: true})
    dsConfig: object = config,
  ) {
    dsConfig = Object.assign({}, dsConfig, {
      options: {baseUrl: process.env.CHAT_SERVICE_URL},
    });
    super(dsConfig);
  }
}

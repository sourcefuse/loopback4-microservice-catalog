// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {SearchServiceBindings} from '@sourceloop/search-service';

const config = {
  name: SearchServiceBindings.DATASOURCE_NAME,
  connector: process.env.DB_CONNECTOR ?? 'postgresql',
  // url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: 'main',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DynamicDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = SearchServiceBindings.DATASOURCE_NAME;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Dynamic', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

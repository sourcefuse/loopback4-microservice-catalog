// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import InMailDatasourceName from '@sourceloop/in-mail-service';

const config = {
  name: InMailDatasourceName,
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class InmailDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = InMailDatasourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.InMailDatasourceName`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

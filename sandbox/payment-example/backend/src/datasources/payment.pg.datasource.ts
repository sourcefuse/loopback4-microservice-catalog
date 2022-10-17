// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '@sourceloop/payment-service';

const config = {
  name: PaymentDatasourceName,
  connector: 'postgresql',
  // url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class PaymentDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'payment';
  static readonly defaultConfig = config;

  constructor(
    // You need to set datasource configuration name
    //as 'datasources.config.inmail' otherwise you might get Errors
    @inject('datasources.config.payment', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {BpmnDbSourceName, BpmnServiceComponentOptions} from '../types';
import {BPMNServiceBindings} from '../keys';

const config = {
  name: BpmnDbSourceName,
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, //NOSONAR
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BpmnDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = BpmnDbSourceName;
  static readonly defaultConfig = config;

  // @ts-ignore
  constructor(
    @inject(BPMNServiceBindings.BPMNServiceConfig)
    private readonly serviceConfig: BpmnServiceComponentOptions,
    @inject('datasources.config.BpmnDb', {optional: true})
      dsConfig: object = config,
  ) {
    Object.assign(dsConfig, {
      ...serviceConfig,
    });
    super(dsConfig);
  }
}

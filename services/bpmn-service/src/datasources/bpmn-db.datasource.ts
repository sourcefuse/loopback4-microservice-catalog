import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {BpmnServiceComponentOptions} from '../types';
import {BPMNServiceBindings} from '../keys';

const config = {
  name: 'BpmnDb',
  connector: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres', //NOSONAR
  database: 'bpmn',
  schema: 'bpmn',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BpmnDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'BpmnDb';
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

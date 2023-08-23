import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {WorkflowServiceSourceName} from '../..';

const config = {
  name: WorkflowServiceSourceName,
  connector: 'memory',
  localStorage: '',
  file: '',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class WorkflowDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = WorkflowServiceSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${WorkflowServiceSourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {TaskDbSourceName} from '../..';

const config = {
  name: TaskDbSourceName,
  connector: 'memory',
  localStorage: '',
  file: '',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PgDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = TaskDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.${TaskDbSourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

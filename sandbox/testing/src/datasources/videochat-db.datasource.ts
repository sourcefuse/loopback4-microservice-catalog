import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise
} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'pgdb',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'videochat',
  schema: 'main',
};

@lifeCycleObserver('datasource')
export class VideochatDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'videochatDb';

  constructor(
    @inject('datasources.config.videochatDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

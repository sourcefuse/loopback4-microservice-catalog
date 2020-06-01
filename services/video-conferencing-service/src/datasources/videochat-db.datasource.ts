import {inject, lifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './videochat-db.datasource.config.json';

@lifeCycleObserver('datasource')
export class VideochatDbDataSource extends juggler.DataSource {
  static dataSourceName = 'videochatDb';

  constructor(
    @inject('datasources.config.videochatDb', {optional: true})
    dsConfig: object = config,
  ) {
    Object.assign(dsConfig, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
    });
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

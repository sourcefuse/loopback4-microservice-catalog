import { LifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class PgdbDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    constructor(dsConfig?: object);
    /**
     * Start the datasource when application is started
     */
    start(): ValueOrPromise<void>;
    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop(): ValueOrPromise<void>;
}

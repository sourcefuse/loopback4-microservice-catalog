import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class PgDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        url: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        schema: string;
    };
    constructor(dsConfig?: object);
}

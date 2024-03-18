import {DbName, Strategies} from '../enums';

/* The `DataStoreAdapterOptions` interface is defining a set of properties that represent the options or
configuration settings for a database adapter. These properties include: */
export interface SequelizeDataStoreConfiguration {
  type: DbName.POSTGRES | DbName.MYSQL;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  databaseType: DbName;
  strategy: Strategies;
}

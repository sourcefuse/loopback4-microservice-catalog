import {S3DataStoreConfiguration} from './s3-data-store.config.interface';
import {SequelizeDataStoreConfiguration} from './sequelize-data-store.config.interface';

export type DataStoreConfiguration =
  | SequelizeDataStoreConfiguration
  | S3DataStoreConfiguration;

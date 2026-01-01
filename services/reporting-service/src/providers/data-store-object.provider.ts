import {Context, Provider, inject} from '@loopback/core';
import {Sequelize} from 'sequelize';
import {DataStoreConfiguration} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';

import * as AWS from 'aws-sdk';
export type DataStoreObjectInterface = Sequelize | AWS.S3;
/* The `DataStoreObjectProvider` class is a TypeScript class that provides a data store object based on
the configuration provided. */
export class DataStoreObjectProvider implements Provider<DataStoreObjectInterface> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_CONFIGURATION)
    private readonly config: DataStoreConfiguration,
    @inject.context() private readonly ctx: Context,
  ) {}

  /**
   * The function returns a data store object based on the configuration type provided.
   * @returns The function `value()` returns an object that implements the `DataStoreObjectInterface`.
   * The specific type of object returned depends on the configuration provided. If the configuration
   * is of type `SequelizeDataStoreConfiguration`, a `Sequelize` object is returned. If the
   * configuration is of type `S3DataStoreConfiguration`, an `AWS.S3` object is returned. If the
   * configuration is
   */
  value(): Promise<DataStoreObjectInterface> {
    const providerKey = `datastores.${this.config.strategy}ObjectProvider`;

    return this.ctx.get<DataStoreObjectInterface>(providerKey);
  }
}

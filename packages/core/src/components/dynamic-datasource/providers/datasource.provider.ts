import {Provider, ValueOrPromise, inject} from '@loopback/core';
import {AnyObject, juggler} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  DatasourceIdentifier,
  DatasourceProviderFn,
} from 'loopback4-dynamic-datasource';
import {DynamicDataSourceBinding} from '../keys';
import {DataSourceConfigProviderFn, DynamicDatasourceConfig} from '../types';

/**
 * this provider returns a property with an async function,
 * this function returns a juggler datasource based on the config value
 * the property name will be the one used in the repository for datasource injection
 */
export class DatasourceProvider implements Provider<DatasourceProviderFn> {
  constructor(
    @inject(DynamicDataSourceBinding.DATA_SOURCE_CONFIG_PROVIDER)
    private readonly configProvider: DataSourceConfigProviderFn,
    @inject(DynamicDataSourceBinding.CONFIG)
    private readonly config: DynamicDatasourceConfig,
  ) {}
  value(): ValueOrPromise<DatasourceProviderFn> {
    return async (datasourceIdentifier: DatasourceIdentifier) => {
      const tenantId = datasourceIdentifier.id;
      if (!tenantId) {
        throw new HttpErrors.InternalServerError('Tenant Id not available');
      }
      const dataSourceConfigs = await this.configProvider(tenantId);
      const dataSourceNames = this.config.dataSourceNames ?? ['db'];
      return this.combineArraysIntoObject(
        dataSourceNames,
        dataSourceConfigs,
      ).then((combinedObject: AnyObject) => combinedObject);
    };
  }

  async combineArraysIntoObject(
    keys: string[],
    configs: AnyObject[],
  ): Promise<{[key: string]: () => Promise<juggler.DataSource>}> {
    // Map each config to an async function that creates a new instance of juggler.Datasource
    const asyncFunctions = configs.map(async config => {
      const dataSource = await this.createDatasource(config);
      return () => Promise.resolve(dataSource);
    });

    // Combine keys and resolved datasources into an object
    const combinedObject: {[key: string]: () => Promise<juggler.DataSource>} =
      {};
    keys.forEach((key, index) => {
      combinedObject[key] = async () => {
        const func = await asyncFunctions[index]; // Calling the async function here to resolve the promise
        return func();
      };
    });

    return combinedObject;
  }

  async createDatasource(config: AnyObject): Promise<juggler.DataSource> {
    return new juggler.DataSource(config);
  }
}

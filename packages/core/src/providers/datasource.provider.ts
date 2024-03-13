import {Provider, ValueOrPromise, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  DatasourceIdentifier,
  DatasourceProviderFn,
} from 'loopback4-dynamic-datasource';
import {DynamicDataSourceBinding, SFCoreBindings} from '../keys';
import {CoreConfig, DataSourceConfigProviderFn} from '../types';

/**
 * this provider returns a property with an async function,
 * this function returns a juggler datasource based on the config value
 * the property name will be the one used in the repository for datasource injection
 */
export class DatasourceProvider implements Provider<DatasourceProviderFn> {
  constructor(
    @inject(DynamicDataSourceBinding.DATA_SOURCE_CONFIG_PROVIDER)
    private readonly configProvider: DataSourceConfigProviderFn,
    @inject(SFCoreBindings.config, {optional: true})
    private readonly coreConfig: CoreConfig,
  ) {}
  value(): ValueOrPromise<DatasourceProviderFn> {
    return async (datasourceIdentifier: DatasourceIdentifier) => {
      const tenantId = datasourceIdentifier.id;
      if (!tenantId) {
        throw new HttpErrors.InternalServerError('Tenant Id not available');
      }
      const dataSourceConfig = await this.configProvider(tenantId);
      const dataSourceName = this.coreConfig.dataSourceName ?? 'db';
      return {
        [dataSourceName]: async () => {
          return new juggler.DataSource({...dataSourceConfig});
        },
      };
    };
  }
}

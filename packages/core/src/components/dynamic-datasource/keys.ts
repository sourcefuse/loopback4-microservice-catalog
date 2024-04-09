import {BindingKey} from '@loopback/core';
import {DataSourceConfigProviderFn, DynamicDatasourceConfig} from './types';

export namespace DynamicDataSourceBinding {
  export const DATA_SOURCE_CONFIG_PROVIDER =
    BindingKey.create<DataSourceConfigProviderFn>(
      `arc.dynamic.datasource.config.provider`,
    );
  export const CONFIG = BindingKey.create<DynamicDatasourceConfig>(
    `arc.dynamic.datasource.config`,
  );
}

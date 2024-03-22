import {AnyObject} from '@loopback/repository';

export interface DataSourceConfigProviderFn {
  (tenantId: string): Promise<AnyObject[]>;
}
export interface DynamicDatasourceConfig {
  dataSourceNames: string[];
}

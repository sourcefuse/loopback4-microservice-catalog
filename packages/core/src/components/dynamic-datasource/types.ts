import {AnyObject} from '@loopback/repository';

// sonarignore:start
export interface DataSourceConfigProviderFn {
  (tenantId: string): Promise<AnyObject[]>;
}
// sonarignore:end

export interface DynamicDatasourceConfig {
  dataSourceNames: string[];
}

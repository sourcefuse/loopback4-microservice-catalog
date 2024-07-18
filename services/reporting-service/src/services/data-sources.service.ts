import {BindingScope, inject, injectable} from '@loopback/core';

import {ResponseDataType} from '../enums';
import {
  ColumnForDataSourceModel,
  DataSourceList,
  DataStoreAdapter,
} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';
import {DataTypeMapping} from '../providers/data-mappings-providers/data-type-mapping';

@injectable({scope: BindingScope.SINGLETON})
/* The `DataSourcesService` class provides methods for retrieving and manipulating data sources and
their columns. */
export class DataSourcesService {
  /**
   * The constructor function initializes a DataStoreAdapter based on the database type and options
   * provided in the environment variables.
   */
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_ADAPTER)
    private dataStoreAdapter: DataStoreAdapter,
    @inject(ReportingServiceComponentBindings.DATA_TYPE_MAP, {optional: true})
    private dataTypeMap: Record<string, DataTypeMapping> | undefined,
  ) {}

  /**
   * The function "listdataSources" asynchronously retrieves a list of data sources from the data store
   * adapter and returns it as an array of DataSourceList objects.
   * @returns a Promise that resolves to an array of DataSourceList objects.
   */
  async listdataSources(): Promise<DataSourceList[]> {
    return this.dataStoreAdapter.listdataSources();
  }

  /**
   * The function "listDataSourceColumns" asynchronously retrieves a list of columns for a given data
   * source.
   * @param {string} dataSource - A string representing the name or identifier of the data source.
   * @returns a Promise that resolves to an array of ColumnForDataSourceModel objects.
   */
  async listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    const columns = await this.dataStoreAdapter.listDataSourceColumns(
      dataSource,
    );

    if (this.dataTypeMap) {
      return columns.map(column => {
        const dataTypeMapping = this.dataTypeMap?.[column.dataType];
        if (dataTypeMapping) {
          return {
            ...column,
            dataType: dataTypeMapping.dataType,
          };
        } else {
          return {
            ...column,
            dataType: ResponseDataType.unknown,
          };
        }
      }) as ColumnForDataSourceModel[];
    }

    return columns;
  }

  /**
   * The function `getTotalDataSourceCount` returns the total number of data sources by listing the
   * tables and returning the length of the resulting array.
   * @returns the total count of data sources as a number.
   */
  async getTotalDataSourceCount(): Promise<number> {
    const tables = await this.dataStoreAdapter.listdataSources();

    return tables.length;
  }
}

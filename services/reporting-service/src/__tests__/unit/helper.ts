import {Application} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import * as sinon from 'sinon';
import {
  ColumnEntityPair,
  ColumnForDataSourceModel,
  DataSourceList,
  DataStoreAdapter,
  IngestReportRecord,
  StructuredQueryInterface,
} from '../../interfaces';
import {DataSet} from '../../models';

export async function setupApplication(): Promise<Application> {
  const app = new Application();
  // Add other application setup code here if necessary
  return app;
}

export function givenStubbedRepository<T>(
  constructor: sinon.StubbableType<T>,
): sinon.SinonStubbedInstance<T> {
  return sinon.createStubInstance(constructor);
}

export class MockDataStoreAdapter implements DataStoreAdapter {
  query: sinon.SinonStub<[StructuredQueryInterface], Promise<AnyObject[]>>;
  constructor() {
    // Stub the methods in the constructor
    this.query = sinon
      .stub<[StructuredQueryInterface], Promise<AnyObject[]>>()
      .resolves([{mockColumn: 'mockValue'}]);
    // Stub other methods similarly
  }
  async listdataSources(): Promise<DataSourceList[]> {
    // Mocked data source list
    return [
      {
        dataSourceName: 'mockDataSource',
        displayName: 'Mock Data Source',
      },
    ];
  }

  async manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier: string,
  ): Promise<AnyObject> {
    // Mocked manage record response
    return {affectedRows: 1};
  }

  async listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    // Mocked data source columns list
    return [
      {
        columnName: 'mockColumn',
        dataSourceName: dataSource,
        displayName: 'Mock Column',
        originalDataType: 'string',
        dataType: 'string',
      } as ColumnForDataSourceModel,
    ];
  }

  async checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean> {
    // Assume the data source exists for the mock
    return true;
  }

  async checkIfColumnsExists(
    columnEntityPairs: ColumnEntityPair[],
  ): Promise<boolean> {
    // Assume the columns exist for the mock
    return true;
  }

  async applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface> {
    // Return the initial query for simplicity in the mock
    return initialQuery;
  }
}

export function givenMockDataSet(overrides: Partial<DataSet> = {}): DataSet {
  // Default values for the mock DataSet
  const defaultDataSet: DataSet = new DataSet({
    id: 'default-id', // Default id
    name: 'Custom DataSet', // Default name
    dataSetQuery: {
      select: {
        fields: ['field1', 'field2'],
      },
      from: 'dataSource1',
    },
    dataSetQueryHash:
      'fd5d2df7b996dd11a96a2a2692e8fec6b3ae09afe63cab73affd5168d83ac32a', // Default hash
    extId: 'default-ext-id', // Default external id
    extMetadata: {key: 'value'}, // Default external metadata
    // Add other default properties for the DataSet if needed
  } as Partial<DataSet>);

  // Override the default values with any provided overrides
  Object.assign(defaultDataSet, overrides);

  return defaultDataSet;
}

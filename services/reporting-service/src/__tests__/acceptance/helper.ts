import {BindingScope} from '@loopback/core';
import {AnyObject, juggler} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {ReportingServiceComponent} from '../../component';
import {DbName, Strategies} from '../../enums';
import {
  ColumnEntityPair,
  ColumnForDataSourceModel,
  DataSourceList,
  DataStoreAdapter,
  IngestReportRecord,
  SequelizeDataStoreConfiguration,
  StructuredQueryInterface,
} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';
import {
  DataSetsRepository,
  IngestionMappingsRepository,
  StateTrackingRepository,
} from '../../repositories';
import {SequelizeQueryUtility} from '../../utils/sequelize-query.utils';
function createMockColumnForDataSourceModel(
  data: Partial<ColumnForDataSourceModel>,
): ColumnForDataSourceModel {
  return {
    columnName: data.columnName ?? 'default_column_name',
    dataSourceName: data.dataSourceName ?? 'default_data_source_name',
    displayName: data.displayName ?? 'Default Display Name',
    originalDataType: data.originalDataType ?? 'string',
    dataType: data.dataType ?? 'string',
    // Stub implementations for toJSON and toObject
    toJSON: () => data,
    toObject: () => data,
  } as ColumnForDataSourceModel;
}
class MockDataStoreAdapter implements DataStoreAdapter {
  async listdataSources(): Promise<DataSourceList[]> {
    // Return mock data source list
    return [
      {dataSourceName: 'mock_table', displayName: 'Mock Table'},
      // ... add more mock data sources if needed ...
    ];
  }

  // Implementing missing applyRowLevelFilter method
  async applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface> {
    // For mock purposes, return the initial query without modifications
    return initialQuery;
  }

  async query(
    queryObject: StructuredQueryInterface | string,
  ): Promise<AnyObject[]> {
    // Mocked response
    return [{column1: 'value1', column2: 'value2'}];
  }

  async listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    // Mocked response
    return [
      createMockColumnForDataSourceModel({
        columnName: 'column1',
        dataType: 'string',
        dataSourceName: 'dataSource',
        displayName: 'Column 1',
        originalDataType: 'string',
      }),
      // Add more mock columns if needed
    ];
  }

  async checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean> {
    const validDataSources = ['users', 'mock_table'];
    return dataSourceNames.every(dataSource =>
      validDataSources.includes(dataSource),
    );
  }

  async checkIfColumnsExists(
    columnEntityPairs: ColumnEntityPair[],
  ): Promise<boolean> {
    const validColumnEntityPairs = [
      {dataSourceName: 'users', column: 'id'},
      {dataSourceName: 'users', column: 'created_by'},
      {dataSourceName: 'users', column: 'first_name'},
      {
        dataSourceName: 'mock_table',
        column: 'column1',
      },
      {
        dataSourceName: 'mock_table',
        column: 'column2',
      },
      // Include additional valid column-entity pairs if needed
    ];
    return columnEntityPairs.every(pair =>
      validColumnEntityPairs.some(
        validPair =>
          validPair.dataSourceName === pair.dataSourceName &&
          validPair.column === pair.column,
      ),
    );
  }

  async manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier = 'id',
  ): Promise<AnyObject> {
    // Mocked response
    return {success: true};
  }
}
export async function setUpApplication(): Promise<AppWithClient> {
  const app = new RestApplication({
    rest: givenHttpServerConfig(),
  });

  // Mock datasource configuration
  const dsConfig = {
    name: 'ReportingCore',
    connector: 'memory',
  };
  const dataSource = new juggler.DataSource(dsConfig);
  app.bind('datasources.ReportingCore').to(dataSource);

  // Mock SQL configuration
  const mockSqlConfig: SequelizeDataStoreConfiguration = {
    type: DbName.POSTGRES,
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'test_db',
    databaseType: DbName.POSTGRES,
    strategy: Strategies.Sequelize,
  };
  const mockDataStoreAdapter = new MockDataStoreAdapter();
  // Bind the mock DataStoreAdapter to the application
  app.bind('dataStoreAdapter').to(mockDataStoreAdapter);
  app
    .bind(ReportingServiceComponentBindings.DATA_STORE_CONFIGURATION)
    .to(mockSqlConfig);

  // Bind the Reporting Service Component
  app.component(ReportingServiceComponent);

  // Bind in-memory datasource to the IngestionMappingsRepository
  app
    .bind('repositories.IngestionMappingsRepository')
    .toClass(IngestionMappingsRepository)
    .inScope(BindingScope.SINGLETON);

  app
    .bind('repositories.DataSetsRepository')
    .toClass(DataSetsRepository)
    .inScope(BindingScope.SINGLETON);
  app
    .bind('repositories.StateTrackingRepository')
    .toClass(StateTrackingRepository)
    .inScope(BindingScope.SINGLETON);
  app
    .bind(ReportingServiceComponentBindings.QUERY_UTILITY)
    .toClass(SequelizeQueryUtility);
  // Start the application
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: RestApplication;
  client: Client;
}

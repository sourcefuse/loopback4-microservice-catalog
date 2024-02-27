import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {DataSourcesService} from '../../../services/data-sources.service';
import {MockDataStoreAdapter, setupApplication} from '../helper';

import {ResponseDataType} from '../../../enums';
import {ColumnForDataSourceModel} from '../../../interfaces';
import {DataTypeMapping} from '../../../providers/data-mappings-providers/data-type-mapping';

describe('DataSourcesService', () => {
  let dataSourcesService: DataSourcesService;
  let mockDataStoreAdapter: MockDataStoreAdapter;

  beforeEach(async () => {
    await setupApplication();
    mockDataStoreAdapter = new MockDataStoreAdapter();
    sinon
      .stub(mockDataStoreAdapter, 'listdataSources')
      .resolves([
        {dataSourceName: 'mockDataSource', displayName: 'Mock Data Source'},
      ]);
    sinon.stub(mockDataStoreAdapter, 'listDataSourceColumns').resolves([
      {
        columnName: 'mockColumn',
        dataSourceName: 'mockDataSource',
        displayName: 'Mock Column',
        originalDataType: 'string',
        dataType: 'string',
      } as ColumnForDataSourceModel,
    ]);

    dataSourcesService = new DataSourcesService(mockDataStoreAdapter, {});
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  describe('listdataSources', () => {
    it('should return a list of data sources', async () => {
      const dataSourceList = await dataSourcesService.listdataSources();
      expect(dataSourceList).to.be.an.Array();
      expect(dataSourceList[0].dataSourceName).to.equal('mockDataSource');
      sinon.assert.calledOnce(
        mockDataStoreAdapter.listdataSources as sinon.SinonSpy,
      );
    });
  });

  describe('listDataSourceColumns', () => {
    it('should return a list of columns for a given data source', async () => {
      const columns =
        await dataSourcesService.listDataSourceColumns('mockDataSource');
      expect(columns).to.be.an.Array();
      expect(columns[0].columnName).to.equal('mockColumn');
      sinon.assert.calledOnce(
        mockDataStoreAdapter.listDataSourceColumns as sinon.SinonSpy,
      );
    });

    it('should map the data types of columns based on dataTypeMap', async () => {
      const dataTypeMap: Record<string, DataTypeMapping> = {
        string: {
          dataType: ResponseDataType.string, // Use enum value for type safety
          jsonValueType: 'string',
        },
      };

      dataSourcesService = new DataSourcesService(
        mockDataStoreAdapter,
        dataTypeMap,
      );

      const columns =
        await dataSourcesService.listDataSourceColumns('mockDataSource');

      expect(columns[0].dataType).to.equal(ResponseDataType.string);
    });
  });

  describe('getTotalDataSourceCount', () => {
    it('should return the total count of data sources', async () => {
      const count = await dataSourcesService.getTotalDataSourceCount();
      expect(count).to.be.a.Number();
      expect(count).to.equal(1);
      sinon.assert.calledOnce(
        mockDataStoreAdapter.listdataSources as sinon.SinonSpy,
      );
    });
  });
});

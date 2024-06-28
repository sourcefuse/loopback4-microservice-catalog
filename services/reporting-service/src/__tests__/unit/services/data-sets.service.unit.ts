import {expect} from '@loopback/testlab';
import * as sinon from 'sinon';
import {
  FunctionExpression,
  QueryUtilityInterface,
  SqlValidatorInterface,
  StructuredQueryInterface,
} from '../../../interfaces';
import {DataSetsRepository} from '../../../repositories';
import {DataSetsService} from '../../../services/data-sets.service';
import {
  MockDataStoreAdapter,
  givenMockDataSet,
  givenStubbedRepository,
  setupApplication,
} from '../helper';

describe('DataSetsService', () => {
  let dataSetsService: DataSetsService;
  let dataSetsRepo: sinon.SinonStubbedInstance<DataSetsRepository>;
  let mockDataStoreAdapter: MockDataStoreAdapter;
  let mockQueryUtility: QueryUtilityInterface;

  before('setupApplication', async () => {
    await setupApplication();
    dataSetsRepo = givenStubbedRepository(DataSetsRepository);
    mockDataStoreAdapter = new MockDataStoreAdapter();
    mockQueryUtility = {
      validateQueryObject: sinon.stub().returns(true),
      listAllDataSourcesFromJson: sinon.stub().returns(['mockDataSource']),
      prepareFinalSqlQuery: sinon.stub().returns(''),
      jsonToQueryConverter: sinon
        .stub()
        .returns({query: 'mockQuery', bind: {}}),
    };

    dataSetsService = new DataSetsService(
      dataSetsRepo,
      mockDataStoreAdapter,
      // sonarignore:start
      mockQueryUtility as QueryUtilityInterface,
      // sonarignore:end
      {} as SqlValidatorInterface,
      {hashFields: ['name']},
    );
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  describe('createDataSet', () => {
    it('should create and return a dataset', async () => {
      const mockDataSet = givenMockDataSet();
      dataSetsRepo.create.resolves(mockDataSet);
      const result = await dataSetsService.createDataSet(mockDataSet);
      expect(result).to.eql(mockDataSet);
      sinon.assert.calledOnceWithExactly(dataSetsRepo.create, mockDataSet);
    });
  });

  describe('getDataSetById', () => {
    it('should retrieve a dataset by id', async () => {
      const mockDataSet = givenMockDataSet({id: 'testId'});
      dataSetsRepo.findById.resolves(mockDataSet);
      const result = await dataSetsService.getDataSetById('testId');
      expect(result).to.eql(mockDataSet);
      sinon.assert.calledWith(dataSetsRepo.findById, 'testId');
    });
  });

  describe('getAllDataSets', () => {
    it('should retrieve all datasets', async () => {
      const mockDataSets = [
        givenMockDataSet({name: 'DataSet1'}),
        givenMockDataSet({name: 'DataSet2'}),
      ];
      dataSetsRepo.find.resolves(mockDataSets);
      const result = await dataSetsService.getAllDataSets();
      expect(result).to.eql(mockDataSets);
      sinon.assert.calledOnce(dataSetsRepo.find);
    });
  });

  describe('deleteDataSetById', () => {
    it('should delete a dataset by id', async () => {
      dataSetsRepo.deleteById.resolves();
      await dataSetsService.deleteDataSetById('testId');
      sinon.assert.calledWith(dataSetsRepo.deleteById, 'testId');
    });
  });

  describe('updateDataSetById', () => {
    it('should update a dataset by id', async () => {
      const mockDataSet = givenMockDataSet({name: 'Updated DataSet'});
      dataSetsRepo.updateById.resolves();
      await dataSetsService.updateDataSetById('testId', mockDataSet);
      sinon.assert.calledWith(dataSetsRepo.updateById, 'testId', mockDataSet);
    });
  });

  describe('getCount', () => {
    it('should return the count of datasets', async () => {
      dataSetsRepo.count.resolves({count: 2});
      const count = await dataSetsService.getCount();
      expect(count).to.eql({count: 2});
      sinon.assert.calledOnce(dataSetsRepo.count);
    });
  });

  describe('fetchDataById', () => {
    it('should fetch data by ID', async () => {
      const id = 'testId';
      const filter = {};
      const mockData = [{sampleData: 'data'}];
      mockDataStoreAdapter.query.resolves(mockData);
      const result = await dataSetsService.fetchDataById(id, filter);
      expect(result).to.eql(mockData);
      sinon.assert.calledOnce(mockDataStoreAdapter.query);
    });
  });

  describe('fetchDataByIdCount', () => {
    it('should fetch data count by id', async () => {
      const id = 'testId';
      const filter = {};

      // Define the expected arguments for the query method calls
      const expectedFirstCallArg: StructuredQueryInterface = {
        select: {
          fields: [
            {
              function: 'COUNT',
              args: ['*'], // Assuming counting all records
              alias: 'count',
            } as FunctionExpression, // Casting to FunctionExpression to satisfy the FieldExpression type requirement
          ],
        },
        from: 'dataSource1',
      };

      mockDataStoreAdapter.query.onFirstCall().resolves([{count: 10}]);
      await dataSetsService.fetchDataByIdCount(id, filter);

      sinon.assert.calledOnce(mockDataStoreAdapter.query);
      sinon.assert.calledWithExactly(
        mockDataStoreAdapter.query.getCall(0),
        expectedFirstCallArg,
      );
    });
  });
});

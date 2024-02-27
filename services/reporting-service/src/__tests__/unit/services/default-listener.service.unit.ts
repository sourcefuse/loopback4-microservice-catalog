import {expect} from '@loopback/testlab';
import {DefaultListenerService} from '../../../services/default-listener.service';
import {MockDataStoreAdapter} from '../helper';
import sinon from 'sinon';
import {ILogger} from '@sourceloop/core';
import {IngestionMapping} from '../../../models';
import {IngestReportRecord} from '../../../interfaces';

describe('DefaultListenerService', () => {
  let defaultListenerService: DefaultListenerService;
  let mockDataStoreAdapter: MockDataStoreAdapter;
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;

  beforeEach(async () => {
    mockDataStoreAdapter = new MockDataStoreAdapter();
    mockLogger = {
      info: sinon.stub(),
      error: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<ILogger>;

    sinon
      .stub(mockDataStoreAdapter, 'manageRecord')
      .resolves({affectedRows: 1});

    defaultListenerService = new DefaultListenerService(mockLogger);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('processMessage', () => {
    it('should process a valid message and update the database', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {
          operation: 'INSERT',
          currentValue: {key: 'value'},
        },
      };

      const ingestionMappingContext: IngestionMapping = {
        dataSourceName: 'testDataSource',
        recordType: 'testRecordType',
        primaryColumn: 'testId',
        columnTransformations: {}, // Assuming this satisfies the interface
        getId: () => 'testId',
        getIdObject: () => ({id: 'testId'}),
        toJSON: () => ({}),
        toObject: () => ({}),
      };

      await defaultListenerService.processMessage(
        mockDataStoreAdapter,
        payload,
        ingestionMappingContext,
      );

      sinon.assert.calledOnce(
        mockDataStoreAdapter.manageRecord as sinon.SinonStub,
      );
      sinon.assert.calledWith(
        mockLogger.info as sinon.SinonStub,
        sinon.match.string,
      );
    });

    it('should log an error if database operation fails', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {operation: 'INSERT', currentValue: {key: 'value'}},
      } as IngestReportRecord;
      const ingestionMappingContext: IngestionMapping = {
        dataSourceName: 'testDataSource',
        recordType: 'testRecordType',
        primaryColumn: 'testId',
        columnTransformations: {},
        getId: () => 'testId',
        getIdObject: () => ({id: 'testId'}),
        toJSON: () => ({}),
        toObject: () => ({}),
      } as IngestionMapping;

      (mockDataStoreAdapter.manageRecord as sinon.SinonStub).rejects(
        new Error('DB operation failed'),
      );

      await expect(
        defaultListenerService.processMessage(
          mockDataStoreAdapter,
          payload,
          ingestionMappingContext,
        ),
      ).to.be.rejectedWith('DB operation failed');

      sinon.assert.calledWith(
        mockLogger.error as sinon.SinonStub,
        sinon.match.string,
      );
    });
  });
});

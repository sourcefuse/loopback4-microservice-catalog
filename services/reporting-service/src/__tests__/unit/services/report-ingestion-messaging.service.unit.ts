import {expect} from '@loopback/testlab';
import {ILogger} from '@sourceloop/core';
import sinon from 'sinon';
import {IngestReportRecord} from '../../../interfaces/ingest-report-record.interface';
import {StateTracking} from '../../../models/state-tracking.model';
import {StateTrackingRepository} from '../../../repositories';
import {DefaultListenerService} from '../../../services/default-listener.service';
import {ReportIngestionMessagingService} from '../../../services/report-ingestion-messaging.service';
import {MockDataStoreAdapter} from '../helper';

describe('ReportIngestionMessagingService', () => {
  let reportIngestionMessagingService: ReportIngestionMessagingService;
  let mockDataStoreAdapter: MockDataStoreAdapter;
  let mockStateTrackingRepo: sinon.SinonStubbedInstance<StateTrackingRepository>;
  let mockDefaultListenerService: sinon.SinonStubbedInstance<DefaultListenerService>;
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;

  beforeEach(async () => {
    mockDataStoreAdapter = new MockDataStoreAdapter();
    mockStateTrackingRepo = sinon.createStubInstance(StateTrackingRepository);
    mockDefaultListenerService = sinon.createStubInstance(
      DefaultListenerService,
    );
    mockLogger = {
      log: sinon.stub(),
      info: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub(),
      debug: sinon.stub(),
    };

    reportIngestionMessagingService = new ReportIngestionMessagingService(
      mockStateTrackingRepo,
      mockDefaultListenerService,
      mockLogger as unknown as ILogger,
      mockDataStoreAdapter,
      {},
      new Set<string>(),
      {},
      {},
      {},
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('trackState', () => {
    it('should track state for a new record', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {operation: 'INSERT', currentValue: {key: 'value'}},
      };
      const state = 'Received';

      mockStateTrackingRepo.findOne.resolves(null);

      await reportIngestionMessagingService.trackState(state, payload);

      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('state', state),
      );
      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('recordId', payload.recordId),
      );
    });

    it('should update state for an existing record', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {operation: 'INSERT', currentValue: {key: 'value'}},
      };
      const state = 'Processed';
      const existingTracking = new StateTracking({
        recordId: payload.recordId,
        recordType: payload.recordType,
        timestamp: payload.timestamp,
        state: 'Received',
      } as StateTracking);

      mockStateTrackingRepo.findOne.resolves(existingTracking);

      await reportIngestionMessagingService.trackState(state, payload);

      sinon.assert.calledWith(
        mockStateTrackingRepo.updateById,
        existingTracking.id,
        sinon.match.has('state', state),
      );
    });
  });

  describe('processMessage', () => {
    it('should process a valid message and update state to "Processed"', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {operation: 'INSERT', currentValue: {key: 'value'}},
      };
      // sonarignore:start

      sinon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .stub(reportIngestionMessagingService, 'validateAndLogPayload' as any)
        .returns(true);

      sinon
        .stub(
          reportIngestionMessagingService,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'determineServiceToInvoke' as any,
        )
        .returns(mockDefaultListenerService);

      sinon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .stub(reportIngestionMessagingService, 'applyTransformation' as any)
        .resolves(payload);

      await reportIngestionMessagingService.processMessage(payload);

      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('state', 'Received'),
      );
      sinon.assert.calledWith(
        mockDefaultListenerService.processMessage,
        mockDataStoreAdapter,
        payload,
        sinon.match.any,
      );
      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('state', 'Processed'),
      );
    });
    it('should log error and track state as "Failed" if processing fails', async () => {
      const payload: IngestReportRecord = {
        recordType: 'testType',
        recordId: 'testId',
        timestamp: new Date(),
        cdc: {operation: 'INSERT', currentValue: {key: 'value'}},
      };
      const error = new Error('Processing failed');

      sinon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .stub(reportIngestionMessagingService, 'validateAndLogPayload' as any)
        .returns(true);

      sinon
        .stub(
          reportIngestionMessagingService,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'determineServiceToInvoke' as any,
        )
        .returns(mockDefaultListenerService);

      sinon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .stub(reportIngestionMessagingService, 'applyTransformation' as any)
        .resolves(payload);
      mockDefaultListenerService.processMessage.rejects(error);

      try {
        await reportIngestionMessagingService.processMessage(payload);
        throw new Error('Expected processMessage to throw an error');
      } catch (err) {
        expect(err.message).to.equal(
          'Expected processMessage to throw an error',
        );
      }

      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('state', 'Received'),
      );
      sinon.assert.calledWith(
        mockStateTrackingRepo.create,
        sinon.match.has('state', 'Failed'),
      );
      sinon.assert.called(mockLogger.error);
    });
  });
});
// sonarignore:end

import {expect} from '@loopback/testlab';
import * as sinon from 'sinon';
import {StateTracking} from '../../../models';
import {StateTrackingRepository} from '../../../repositories';
import {StateTrackingService} from '../../../services';
import {givenStubbedRepository, setupApplication} from '../helper';
const DB_ERROR = 'Database error';
const REPO_ERROR = 'should handle errors from the repository';
const FILTER_PROVIDER_ERROR = 'should handle errors from the filter provider';
describe('StateTrackingService', () => {
  let stateTrackingService: StateTrackingService;
  let stateTrackingRepo: sinon.SinonStubbedInstance<StateTrackingRepository>;

  before(async () => {
    await setupApplication();
    stateTrackingRepo = givenStubbedRepository(StateTrackingRepository);
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateTrackingService = new StateTrackingService(stateTrackingRepo as any);
    // sonarignore:end
  });

  describe('findLatestRecord()', () => {
    it('should return the latest record for a given type', async () => {
      const expectedRecord = new StateTracking({
        state: 'processed',
        recordType: 'someType',
        timestamp: new Date(),
        recordId: 'record1',
      } as Partial<StateTracking>);
      stateTrackingRepo.find.resolves([expectedRecord]);

      const result = await stateTrackingService.findLatestRecord('someType');

      expect(result).to.eql(expectedRecord);
    });

    it('should return null if no records are found', async () => {
      stateTrackingRepo.find.resolves([]);

      const result = await stateTrackingService.findLatestRecord('someType');

      expect(result).to.be.null();
    });

    it(FILTER_PROVIDER_ERROR, async () => {
      const recordId = 'specificId';
      const expectedRecord = new StateTracking({
        state: 'failed',
        recordType: 'someType',
        timestamp: new Date(),
        recordId: recordId,
      } as Partial<StateTracking>);
      stateTrackingRepo.find.resolves([expectedRecord]);

      await stateTrackingService.findLatestRecord('someType', recordId);

      // Adjusted to match the service's filter structure
      sinon.assert.calledWithMatch(
        stateTrackingRepo.find,
        sinon.match({
          where: {and: [{recordType: 'someType'}, {recordId}]},
        }),
      );
    });

    it(REPO_ERROR, async () => {
      stateTrackingRepo.find.rejects(new Error(DB_ERROR));

      await expect(
        stateTrackingService.findLatestRecord('someType'),
      ).to.be.rejectedWith(DB_ERROR);
    });
  });

  describe('findAllRecords()', () => {
    it('should return an array of records for a given type', async () => {
      const expectedRecords = [
        new StateTracking({
          state: 'processed',
          recordType: 'someType',
          timestamp: new Date(),
          recordId: 'record3',
        } as Partial<StateTracking>),
        new StateTracking({
          state: 'pending',
          recordType: 'someType',
          timestamp: new Date(),
          recordId: 'record4',
        } as Partial<StateTracking>),
      ];
      stateTrackingRepo.find.resolves(expectedRecords);

      const result = await stateTrackingService.findAllRecords('someType');

      expect(result).to.eql(expectedRecords);
    });

    it('should respect skip and limit parameters', async () => {
      const skip = 5;
      const limit = 10;
      const expectedRecords = [
        new StateTracking({
          state: 'processed',
          recordType: 'someType',
          timestamp: new Date(),
          recordId: 'record5',
        } as Partial<StateTracking>),
      ];
      stateTrackingRepo.find.resolves(expectedRecords);

      const result = await stateTrackingService.findAllRecords(
        'someType',
        skip,
        limit,
      );

      expect(result).to.eql(expectedRecords);
      sinon.assert.calledWithMatch(stateTrackingRepo.find, {
        offset: skip,
        limit: limit,
      });
    });

    it(FILTER_PROVIDER_ERROR, async () => {
      const recordId = 'specificId';
      const expectedRecord = new StateTracking({
        state: 'failed',
        recordType: 'someType',
        timestamp: new Date(),
        recordId: recordId,
      } as Partial<StateTracking>);
      stateTrackingRepo.find.resolves([expectedRecord]);

      await stateTrackingService.findLatestRecord('someType', recordId);

      // Ensuring the 'and' condition is expected in the assertion
      sinon.assert.calledWithMatch(
        stateTrackingRepo.find,
        sinon.match({
          where: {
            and: [{recordType: 'someType'}, {recordId: recordId}],
          },
        }),
      );
    });
    it(REPO_ERROR, async () => {
      stateTrackingRepo.find.rejects(new Error(DB_ERROR));

      await expect(
        stateTrackingService.findAllRecords('someType'),
      ).to.be.rejectedWith(DB_ERROR);
    });
  });

  describe('countRecords()', () => {
    it('should return the count of records for a given type', async () => {
      const count = 5;
      stateTrackingRepo.count.resolves({count: count});

      const result = await stateTrackingService.countRecords('someType');

      expect(result).to.eql({count: count});
    });

    it(FILTER_PROVIDER_ERROR, async () => {
      const recordId = 'specificId3';
      const count = 1;
      stateTrackingRepo.count.resolves({count: count});

      await stateTrackingService.countRecords('someType', recordId);

      // Adjusted to match the service's filter structure
      sinon.assert.calledWithMatch(
        stateTrackingRepo.count,
        sinon.match({
          and: [{recordType: 'someType'}, {recordId}],
        }),
      );
    });

    it(REPO_ERROR, async () => {
      stateTrackingRepo.count.rejects(new Error(DB_ERROR));

      await expect(
        stateTrackingService.countRecords('someType'),
      ).to.be.rejectedWith(DB_ERROR);
    });
  });
});

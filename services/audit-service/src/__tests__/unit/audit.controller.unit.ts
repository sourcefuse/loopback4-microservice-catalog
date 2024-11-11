// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Filter} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {AuditController} from '../../controllers';
import {FileStatusKey} from '../../enums/file-status-key.enum';
import {AuditLogExportServiceBindings} from '../../keys';
import {AuditLog, Job} from '../../models/tenant-support';

import {AuditLogExportProvider} from '../../exporter';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../../repositories';
import {ColumnBuilderProvider, JobProcessingService} from '../../services';
import {AuditLogExportFn, ExportToCsvFn} from '../../types';
import {DummyAuditServiceApplication} from '../fixtures/dummy-application';
import {testUser} from '../helpers/db.helper';
import {dummyLog} from '../sample-data/dummy-log';
import {filterAppliedActedAt} from '../sample-data/filters';

let auditLogRepository: StubbedInstanceWithSinonAccessor<AuditLogRepository>;
let jobRepository: StubbedInstanceWithSinonAccessor<JobRepository>;
let jobProcessingService: StubbedInstanceWithSinonAccessor<JobProcessingService>;
let mappingLogRepository: StubbedInstanceWithSinonAccessor<MappingLogRepository>;

let controller: AuditController;
let app: DummyAuditServiceApplication;
const setUpStub = () => {
  app = new DummyAuditServiceApplication({
    rest: {
      port: 3001,
    },
  });
  app
    .bind(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS)
    .toProvider(AuditLogExportProvider);
  auditLogRepository = createStubInstance(AuditLogRepository);
  jobRepository = createStubInstance(JobRepository);
  jobProcessingService = createStubInstance(JobProcessingService);
  mappingLogRepository = createStubInstance(MappingLogRepository);
  const columnBuilderProvider = new ColumnBuilderProvider();
  const exportToCsvService: ExportToCsvFn = () =>
    Promise.resolve('demoResponse');
  const auditLogExport: AuditLogExportFn = (data: AnyObject[]) =>
    Promise.resolve();

  controller = new AuditController(
    auditLogRepository,
    jobRepository,
    jobProcessingService,
    mappingLogRepository,
    exportToCsvService,
    auditLogExport,
    columnBuilderProvider.value(),
    testUser,
  );
};
beforeEach(setUpStub);

describe('AuditController(unit) ', () => {
  describe('POST /audit-logs', () => {
    it('creates an audit log', async () => {
      const logCreate = auditLogRepository.stubs.create;
      logCreate.resolves(Object.assign(dummyLog, {id: 'uuid'}));
      const controllerResult = await controller.create(dummyLog);
      expect(controllerResult).to.have.a.property('id').which.is.a.String();
      sinon.assert.calledOnce(logCreate);
    });
    it('throws 400 if payload invalid', async () => {
      const logCreate = auditLogRepository.stubs.create;
      logCreate.rejects(new HttpErrors.BadRequest('Invalid Payload'));
      const controllerResult = await controller
        .create({abc: '1'})
        .catch(err => err);
      expect(controllerResult).instanceOf(HttpErrors.BadRequest);
    });
  });

  describe('GET /audit-logs', () => {
    it('fetches all audit logs when includeArchivedLogs is true', async () => {
      const filter = filterAppliedActedAt;
      const includeArchivedLogs = true;
      const job: Job = new Job({
        id: '1',
        status: FileStatusKey.PENDING,
        filterUsed: filterAppliedActedAt,
      });
      const createjobStub = jobRepository.stubs.create;
      createjobStub.resolves(job);
      const controllerResult = await controller.find(
        includeArchivedLogs,
        filter,
      );
      expect(controllerResult).to.be.deepEqual({jobId: '1'});
    });
    it('fetches all audit logs when includeArchivedLogs is false', async () => {
      const includeArchivedLogs = false;

      const logFetch = auditLogRepository.stubs.find;
      const filter: Filter<AuditLog> = {
        where: {
          id: 1,
        },
      };
      logFetch.withArgs(filter).resolves([Object.assign(dummyLog, {id: 1})]);
      logFetch.resolves([
        Object.assign(dummyLog, {id: 1}),
        Object.assign(dummyLog, {id: 2}),
      ]);
      const controllerResult = await controller.find(
        includeArchivedLogs,
        filter,
      );
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.have.length(1);
      const controllerResultWithoutFilter =
        await controller.find(includeArchivedLogs);
      expect(controllerResultWithoutFilter).to.have.length(2);
    });
  });

  describe('GET /audit-logs/count', () => {
    it('fetches count of all audit logs', async () => {
      const logFetch = auditLogRepository.stubs.count;
      logFetch.resolves({
        count: 1,
      });
      const controllerResult = await controller.count();
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.have.property('count').equal(1);
    });
  });

  describe('GET /audit-logs/:id', () => {
    it('fetches audit log by id', async () => {
      const logFetch = auditLogRepository.stubs.findById;
      logFetch.withArgs('1').resolves(dummyLog);
      const controllerResult = await controller.findById('1');
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.be.deepEqual(dummyLog);
    });

    it('gives 404 when audit log not found for given id', async () => {
      const logFetch = auditLogRepository.stubs.findById;
      logFetch.withArgs('1').rejects(new HttpErrors.NotFound('Not Found'));
      const controllerResult = await controller.findById('1').catch(err => err);
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).instanceOf(HttpErrors.NotFound);
    });
  });
});

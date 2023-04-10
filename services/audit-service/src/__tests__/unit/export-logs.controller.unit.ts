// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createStubInstance,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {Filter} from '@loopback/repository';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import {ExportLogsController} from '../../controllers';
import {dummyLog} from '../sample-data/dummy-log';
import {AuditLogExportService} from '../../services';

let auditLogRepository: StubbedInstanceWithSinonAccessor<AuditLogRepository>;
let auditLogExportService: StubbedInstanceWithSinonAccessor<AuditLogExportService>;
let controller: ExportLogsController;

const setUpStub = () => {
  auditLogRepository = createStubInstance(AuditLogRepository);
  auditLogExportService = createStubInstance(AuditLogExportService);
  controller = new ExportLogsController(
    auditLogRepository,
    auditLogExportService,
  );
};

beforeEach(setUpStub);

describe('GET /export-logs', () => {
  it('fetches all export logs', async () => {
    const logFetch = auditLogRepository.stubs.find;
    logFetch.resolves([dummyLog]);
    const exportresult = auditLogExportService.stubs.exportToExcel;
    exportresult.resolves(true);
    const controllerResult = await controller.exportAuditLogs();
    sinon.assert.calledOnce(logFetch);
    sinon.assert.calledOnce(exportresult);
    sinon.assert.pass(controllerResult);
  });

  it('fetches only filtered logs', async () => {
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
    const controllerResult = await controller.exportAuditLogs(filter);
    sinon.assert.calledOnce(logFetch);
    sinon.assert.pass(controllerResult);
    const controllerResultWithoutFilter = await controller.exportAuditLogs();
    sinon.assert.pass(controllerResultWithoutFilter);
  });
});

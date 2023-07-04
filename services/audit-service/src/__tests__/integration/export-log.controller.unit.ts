import {
  getTestAuditController,
  givenEmptyTestDB,
  populateTestDB,
} from '../helpers/db.helper';
import {filterAppliedActedAt} from '../sample-data/filters';
import {ColumnBuilderProvider} from '../fixtures/providers/column-builder.service';
import {createStubInstance, expect} from '@loopback/testlab';
import {AuditLogExportProvider} from '../../services';
import {Job} from '../../models';
import {OperationKey} from '../../enums/operation-key.enum';
import {FileStatusKey} from '../../enums/file-status-key.enum';

describe('POST /audit-logs/export', () => {
  beforeEach(async () => {
    await givenEmptyTestDB();
    await populateTestDB();
  });
  it('when includeArchivedLogs is false', async () => {
    const includeArchivedLogs = false;
    const filter = filterAppliedActedAt;
    const {auditLogController, auditLogRepository, getAuditLogExportParameter} =
      getTestAuditController();

    const auditLogs = await auditLogRepository.find(filter);
    const columnBuilderProvider = new ColumnBuilderProvider();
    const result = await columnBuilderProvider.columnBuilder(auditLogs);
    const controllerResult = await auditLogController.export(
      includeArchivedLogs,
      filter,
    );
    expect(controllerResult).to.have.a.property('message').which.is.a.String();
    expect(result).to.be.deepEqual(getAuditLogExportParameter());
  });
  it('when includeArchivedLogs is true', async () => {
    const {auditLogController, jobRepository} = getTestAuditController();
    const includeArchivedLogs = true;
    const job: Job = new Job({
      id: '1',
      status: FileStatusKey.PENDING,
      filterUsed: filterAppliedActedAt,
      operation: OperationKey.EXPORT,
    });
    const filter = filterAppliedActedAt;
    const createjobStub = jobRepository.stubs.create;
    createjobStub.resolves(job);
    const auditLogExport = createStubInstance(AuditLogExportProvider);
    const auditLogExportStub = auditLogExport.stubs.auditLogExport;
    auditLogExportStub.resolves();
    const controllerResult = await auditLogController.export(
      includeArchivedLogs,
      filter,
    );
    expect(controllerResult).to.be.deepEqual({jobId: '1'});
  });
});

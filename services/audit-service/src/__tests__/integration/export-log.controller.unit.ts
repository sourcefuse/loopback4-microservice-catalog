import {juggler} from '@loopback/repository';
import {createStubInstance, expect} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {FileStatusKey} from '../../enums/file-status-key.enum';
import {OperationKey} from '../../enums/operation-key.enum';
import {Job} from '../../models';
import {JobRepository} from '../../repositories';
import {AuditLogExportProvider} from '../../services';
import {DummyAuditServiceApplication} from '../fixtures/dummy-application';
import {ColumnBuilderProvider} from '../fixtures/providers/column-builder.service';
import {
  getTestAuditController,
  givenEmptyTestDB,
  populateTestDB,
  testUser,
} from '../helpers/db.helper';
import {filterAppliedActedAt} from '../sample-data/filters';

describe('POST /audit-logs/export', () => {
  let app: DummyAuditServiceApplication;
  beforeEach(async () => {
    app = new DummyAuditServiceApplication({
      rest: {
        port: 3001,
      },
    });
    const ds = new juggler.DataSource({
      name: 'AuditDB',
      connector: 'memory',
    });
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.dataSource(ds);

    await app.boot();
    await app.start();
    await givenEmptyTestDB();
    await populateTestDB(app);
  });
  afterEach(async () => {
    await app.stop();
  });
  it('when includeArchivedLogs is false', async () => {
    const includeArchivedLogs = false;
    const filter = filterAppliedActedAt;
    const {auditLogController, auditLogRepository, getAuditLogExportParameter} =
      getTestAuditController(app);

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
    const {auditLogController} = getTestAuditController(app);
    const includeArchivedLogs = true;
    const job: Job = new Job({
      id: '1',
      status: FileStatusKey.PENDING,
      filterUsed: filterAppliedActedAt,
      operation: OperationKey.EXPORT,
    });
    const filter = filterAppliedActedAt;
    const jobRepositoryStub = createStubInstance(JobRepository);
    const createjobStub = jobRepositoryStub.stubs.create;
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

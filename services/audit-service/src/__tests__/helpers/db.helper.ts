import {Context} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {sinon} from '@loopback/testlab';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuditController} from '../../controllers';
import {PermissionKey} from '../../enums';
import {AuditLogExportServiceBindings} from '../../keys';
import {AuditLogExportProvider} from '../../providers';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../../repositories/index';
import {JobProcessingService, QuerySelectedFilesProvider} from '../../services';
import {AuditLogExportFn, ExportHandlerFn, ExportToCsvFn} from '../../types';
import {connector} from '../fixtures/datasources/db.datasource';
import {DummyAuditServiceApplication} from '../fixtures/dummy-application';
import {ColumnBuilderProvider} from '../fixtures/providers/column-builder.service';
import {archiveLogs} from '../sample-data/archive-log';
import {listMappingLogs} from '../sample-data/mapping-log';

let auditLogRepository: AuditLogRepository; //NOSONAR
let mappingLogRepository: MappingLogRepository; //NOSONAR
let jobRepository: JobRepository; //NOSONAR
let context: Context;

const pass = 'test_password';
const id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
const tenantId = 'fac65aad-3f01-dd25-3ea0-ee6563fbe02b';
export const testUser: IAuthUserWithPermissions = {
  id: id,
  userTenantId: id,
  username: 'test_user',
  tenantId: tenantId,
  authClientId: 1,
  role: 'test-role',
  firstName: 'testuser',
  lastName: 'sf',
  password: pass,
  permissions: [
    PermissionKey.ViewAudit,
    PermissionKey.CreateAudit,
    PermissionKey.ArchiveLogs,
    PermissionKey.ExportLogs,
  ],
};
export async function givenEmptyTestDB() {
  // clear the DB and set sequence counter to default 1
  connector.reset();
}
export async function populateTestDB(app: DummyAuditServiceApplication) {
  await getTestDBRepositories(app);

  await auditLogRepository.createAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    archiveLogs.map(e => ({...e, after: JSON.stringify(e.after)})) as any,
  );

  await mappingLogRepository.createAll(listMappingLogs);
}

export async function getTestDBRepositories(app: DummyAuditServiceApplication) {
  auditLogRepository = await app.getRepository(AuditLogRepository);
  mappingLogRepository = await app.getRepository(MappingLogRepository);
  jobRepository = await app.getRepository(JobRepository);
  return {auditLogRepository, mappingLogRepository, jobRepository};
}

export function getTestAuditController(app: DummyAuditServiceApplication) {
  let auditLogExportParam: AnyObject[];
  const auditLogExport: AuditLogExportFn = (data: AnyObject[]) => {
    auditLogExportParam = data;
    return Promise.resolve();
  };
  let getSyncStub = sinon.stub().callsFake(key => {
    if (key === AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS) {
      return sinon.stub().resolves(auditLogExport);
    }

    return undefined;
  });

  let context = {
    getSync: getSyncStub,
  } as unknown as Context;

  function getAuditLogExportParameter() {
    return auditLogExportParam;
  }

  const exportToCsvService: ExportToCsvFn = () =>
    Promise.resolve('demoResponse');
  const {jobProcessingService} = getTestJobProcessingService(app);
  const columnBuilderProvider = new ColumnBuilderProvider();

  const auditLogController = new AuditController(
    auditLogRepository,
    jobRepository,
    jobProcessingService,
    mappingLogRepository,
    exportToCsvService,
    context,
    columnBuilderProvider.value(),
    testUser,
  );
  return {
    auditLogController,
    auditLogRepository,
    jobRepository,
    mappingLogRepository,
    exportToCsvService,
    auditLogExport,
    getAuditLogExportParameter,
  };
}

export function getTestJobProcessingService(app: DummyAuditServiceApplication) {
  const querySelectedFilesProvider = new QuerySelectedFilesProvider(app);
  const excelProcessingService: ExportHandlerFn = (fileBuffer: Buffer) =>
    Promise.resolve();

  const columnBuilderProvider = new ColumnBuilderProvider();
  const auditLogExport = new AuditLogExportProvider(excelProcessingService);

  const jobProcessingService = new JobProcessingService(
    querySelectedFilesProvider.value(),
    context,
    columnBuilderProvider.value(),
    mappingLogRepository,
    jobRepository,
    auditLogRepository,
  );
  return {
    querySelectedFilesProvider,
    auditLogRepository,
    mappingLogRepository,
    jobRepository,
    jobProcessingService,
  };
}

export {auditLogRepository, jobRepository, mappingLogRepository};

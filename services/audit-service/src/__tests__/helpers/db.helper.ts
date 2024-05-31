import {AnyObject} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuditController} from '../../controllers';
import {PermissionKey} from '../../enums';
import {AuditLogExportProvider} from '../../exporter';
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
  function getAuditLogExportParameter() {
    return auditLogExportParam;
  }
  const exportToCsvService: ExportToCsvFn = () =>
    Promise.resolve('demoResponse');
  const {jobProcessingService} = getTestJobProcessingService(app);
  const columnBuilderProvider = new ColumnBuilderProvider();
  const auditLogExport: AuditLogExportFn = (data: AnyObject[]) => {
    auditLogExportParam = data;
    return Promise.resolve();
  };
  const auditLogController = new AuditController(
    auditLogRepository,
    jobRepository,
    jobProcessingService,
    mappingLogRepository,
    exportToCsvService,
    auditLogExport,
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
    auditLogExport.value(),
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

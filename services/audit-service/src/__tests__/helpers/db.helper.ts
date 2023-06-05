import {connector, testDB} from '../fixtures/datasources/db.datasource';
import {
  MappingLogRepository,
  JobRepository,
  AuditLogRepository,
} from '../../repositories';
import {archiveLogs} from '../sample-data/archive-log';
import {ArchiveLogController} from '../../controllers';
import {JobProcessingService, QuerySelectedFilesProvider} from '../../services';
import {createStubInstance} from '@loopback/testlab';
import {listMappingLogs, uploaderResponse} from '../sample-data/mapping-log';
import {AuditServiceApplication} from '../../application';
import {ExportToCsvFn} from '../../types';

export async function givenEmptyTestDB() {
  // clear the DB and set sequence counter to default 1
  connector.reset();
}
export async function populateTestDB() {
  const {auditLogRepository, mappingLogRepository} = getTestDBRepositories();

  await auditLogRepository.createAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    archiveLogs.map(e => ({...e, after: JSON.stringify(e.after)})) as any,
  );

  await mappingLogRepository.createAll(listMappingLogs);
}

export function getTestDBRepositories() {
  const auditLogRepository = new AuditLogRepository(testDB);
  const mappingLogRepository = new MappingLogRepository(testDB);
  const jobRepository = new JobRepository(testDB);
  return {auditLogRepository, mappingLogRepository, jobRepository};
}

export function getTestControllers() {
  const auditLogRepository = new AuditLogRepository(testDB);
  const mappingLogRepository = createStubInstance(MappingLogRepository);
  const exportToCsvService: ExportToCsvFn = () =>
    Promise.resolve(uploaderResponse);
  const archiveLogController = new ArchiveLogController(
    auditLogRepository,
    mappingLogRepository,
    exportToCsvService,
  );

  return {archiveLogController, exportToCsvService, mappingLogRepository};
}
export function getTestJobProcessingService() {
  const myApplication = new AuditServiceApplication();

  const querySelectedFilesProvider = new QuerySelectedFilesProvider(
    myApplication,
  );
  const auditLogRepository = new AuditLogRepository(testDB);
  const mappingLogRepository = new MappingLogRepository(testDB);
  const jobRepository = new JobRepository(testDB);
  const jobProcessingService = new JobProcessingService(
    querySelectedFilesProvider.value(),
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

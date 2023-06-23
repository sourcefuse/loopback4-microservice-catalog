import {connector, testDB} from '../fixtures/datasources/db.datasource';
import {
  MappingLogRepository,
  JobRepository,
  AuditLogRepository,
} from '../../repositories';
import {archiveLogs} from '../sample-data/archive-log';
import {AuditController} from '../../controllers';
import {
  AuditLogExportProvider,
  JobProcessingService,
  QuerySelectedFilesProvider,
} from '../../services';
import {createStubInstance} from '@loopback/testlab';
import {listMappingLogs, uploaderResponse} from '../sample-data/mapping-log';
import {AuditServiceApplication} from '../../application';
import {ExportToCsvFn, AuditLogExportFn, ExcelProcessingFn} from '../../types';
import {Logger} from '../logger';
import {ColumnBuilderProvider} from '../fixtures/providers/column-builder.service';
import * as XLSX from 'xlsx';

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

export function getTestAuditController() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let auditLogExportParam: any[];
  function getAuditLogExportParameter() {
    return auditLogExportParam;
  }
  const exportToCsvService: ExportToCsvFn = () =>
    Promise.resolve(uploaderResponse);
  const jobRepository = createStubInstance(JobRepository);
  const mappingLogRepository = createStubInstance(MappingLogRepository);

  const auditLogRepository = new AuditLogRepository(testDB);
  const {jobProcessingService} = getTestJobProcessingService();
  const columnBuilderProvider = new ColumnBuilderProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditLogExport: AuditLogExportFn = (data: any[]) => {
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

export function getTestJobProcessingService() {
  const myApplication = new AuditServiceApplication();
  const querySelectedFilesProvider = new QuerySelectedFilesProvider(
    myApplication,
  );
  const logger = new Logger();
  const excelProcessingService: ExcelProcessingFn = (
    workbook: XLSX.WorkBook,
  ) => {
    return Promise.resolve();
  };
  const columnBuilderProvider = new ColumnBuilderProvider();
  const auditLogExport = new AuditLogExportProvider(
    logger,
    excelProcessingService,
  );
  const auditLogRepository = new AuditLogRepository(testDB);
  const mappingLogRepository = new MappingLogRepository(testDB);
  const jobRepository = new JobRepository(testDB);
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

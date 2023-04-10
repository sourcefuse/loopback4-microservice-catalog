import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {dummyLog} from '../sample-data/dummy-log';
import {
  AuditLogExportService,
  ExportColumnsBuilderService,
} from '../../services';
import fs from 'fs';

let exportColumnsBuilderService: StubbedInstanceWithSinonAccessor<ExportColumnsBuilderService>;
let auditLogExportService: AuditLogExportService;
const deleteLogs = () => Promise.resolve('Logs Deleted');
const saveLogs = () => Promise.resolve('Logs Saved');

describe('creates logs in xlsx format', () => {
  const setUpStub = () => {
    exportColumnsBuilderService = createStubInstance(
      ExportColumnsBuilderService,
    );
    auditLogExportService = new AuditLogExportService(
      exportColumnsBuilderService,
      {deleteLogs},
      {saveLogs},
      logger,
    );
  };

  const logger = {
    log: () => {
      /* This is intentional */
    },
    info: () => {
      /* This is intentional */
    },
    warn: () => {
      /* This is intentional */
    },
    error: () => {
      /* This is intentional */
    },
    debug: () => {
      /* This is intentional */
    },
  };

  beforeEach(setUpStub);

  it('creates Excel file for the computed export data ', async () => {
    const targetDirectory = './Export-logs/';
    fs.mkdir(targetDirectory, err => {
      /*Do Nothing*/
    });
    const exportLogsStatus = await auditLogExportService.exportToExcel(
      [dummyLog],
      targetDirectory,
    );
    expect(exportLogsStatus).to.be.eql(true);
  });

  it('gives an error if target directory not provided ', async () => {
    const targetDirectory = undefined;
    const exportLogsStatus = auditLogExportService.exportToExcel(
      [dummyLog],
      targetDirectory,
    );
    return expect(exportLogsStatus).to.throwError;
  });
});

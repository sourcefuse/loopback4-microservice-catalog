import {injectable, inject, BindingScope} from '@loopback/core';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import {AuditLog} from '../models';
import {ExportColumnsBuilderService} from './export-columns-builder.service';
import {AuditExportServiceBindings} from '../keys';
import {IDeleteLogs, IExportLogsDestinationFn} from '../types';
import {ILogger, LOGGER} from '@sourceloop/core';

@injectable({scope: BindingScope.TRANSIENT})
export class AuditLogExportService {
  constructor(
    @inject(AuditExportServiceBindings.EXPORT_COLUMN)
    private exportColumnsBuilderService: ExportColumnsBuilderService,
    @inject(AuditExportServiceBindings.DELETE_EXPORT_LOGS)
    private deleteAuditExportLogs: IDeleteLogs,
    @inject(AuditExportServiceBindings.SAVE_EXPORT_LOGS)
    private saveAuditExportLogs: IExportLogsDestinationFn,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    /* Do nothing */
  }

  async exportToExcel(
    selectedAuditLogs: AuditLog[],
    targetDirectoryPath = process.env.PATH_TO_EXPORT_FILES_FOLDER,
  ) {
    const worksheetName = 'auditlogs';
    if (!targetDirectoryPath) {
      throw new Error('Path to target directory not defined');
    }
    const targetDirectory = path.join(targetDirectoryPath, '/Export-logs/'); // to create new folder to save xlsx file
    fs.mkdir(targetDirectory, error =>
      error
        ? this.logger.error('Error in Export Logs Directory')
        : this.logger.info('Target Directory Created!'),
    );
    const fileName = `auditLog_records${new Date()
      .toISOString()
      .replace(/[zt]/gi, '')}.xlsx`;
    const filePath = path.join(targetDirectory, fileName);
    const worksheetColumnNames =
      await this.exportColumnsBuilderService.exportColumnNames();
    const data = await this.exportColumnsDataBuilder(selectedAuditLogs);
    const workBook = XLSX.utils.book_new(); // create a new workbook
    const worksheetData = [worksheetColumnNames, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workBook, worksheet, worksheetName);
    XLSX.writeFile(workBook, path.resolve(filePath));

    const logsSavedStatus = await this.saveAuditExportLogs.saveLogs(filePath);
    if (logsSavedStatus) {
      this.logger.info('Export Logs saved at the provided destination');
    }
    const logsDeleted = await this.deleteAuditExportLogs.deleteLogs(
      targetDirectory,
    );
    if (logsDeleted) {
      this.logger.info('Logs Deleted from the local');
    }
    return true;
  }

  async exportColumnsDataBuilder(selectedAuditLogs: AuditLog[]) {
    const compiledExportData: Array<string[]> = [];
    for (const auditLog of selectedAuditLogs) {
      const data = await this.exportColumnsBuilderService.columnValueBuilder(
        auditLog,
      );
      compiledExportData.push(data);
    }
    return compiledExportData;
  }
}

import {injectable, BindingScope, Provider, inject} from '@loopback/core';
import {AuditLogExportFn, ExcelProcessingFn} from '../types';
import * as XLSX from 'xlsx';
import path from 'path';
import * as fs from 'fs';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AnyObject} from '@loopback/repository';
import {ExcelProcessingServiceBindings} from '../keys';

@injectable({scope: BindingScope.TRANSIENT})
export class AuditLogExportProvider implements Provider<AuditLogExportFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
    @inject(ExcelProcessingServiceBindings.PROCESS_EXCEL)
    public excelProcessing: ExcelProcessingFn,
  ) {}

  value(): AuditLogExportFn {
    return async (data: AnyObject[]) => {
      return this.auditLogExport(data);
    };
  }
  async auditLogExport(data: AnyObject[]) {
    if (data.length === 0) {
      return;
    }
    const targetDirectoryPath = process.env.PATH_TO_EXPORT_FILES_FOLDER;
    if (!targetDirectoryPath) {
      throw new Error(
        'Path to the target directory to export the file is not defined.',
      );
    }
    const targetDirectory = path.join(targetDirectoryPath, '/export-logs/');
    try {
      fs.mkdirSync(targetDirectory, {recursive: true});
      this.logger.info('Target Directory Created!');
    } catch (error) {
      if (error.code !== 'EEXIST') {
        const errorMessage = `An error occurred while creating export logs directory: ${error.toString()}`;
        this.logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      this.logger.info('Target Directory Already Exists!');
    }
    const fileName = `audit-logs-${new Date().toISOString()}.xlsx`;
    const filepath = path.join(targetDirectory, fileName);
    const worksheetName = 'Audit Logs';
    const worksheetColumnNames = Object.keys(data[0]);

    const dataValues = data.map(item => {
      const values = Object.values(item);
      const updatedValues = values.map(value => {
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      });
      return updatedValues;
    });

    const worksheetData = [worksheetColumnNames, ...dataValues];
    const workBook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workBook, worksheet, worksheetName);
    XLSX.writeFile(workBook, path.resolve(filepath));
    await this.excelProcessing(workBook);
  }
}

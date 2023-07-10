import {injectable, BindingScope, Provider, inject} from '@loopback/core';
import {AuditLogExportFn, ExportHandlerFn} from '../types';
import * as XLSX from 'xlsx';
import {AnyObject} from '@loopback/repository';
import {ExportHandlerServiceBindings} from '../keys';

@injectable({scope: BindingScope.TRANSIENT})
export class AuditLogExportProvider implements Provider<AuditLogExportFn> {
  constructor(
    @inject(ExportHandlerServiceBindings.PROCESS_FILE)
    public exportHandler: ExportHandlerFn,
  ) {}

  value(): AuditLogExportFn {
    return async (data: AnyObject[]) => this.auditLogExport(data);
  }
  async auditLogExport(data: AnyObject[]) {
    if (data.length === 0) {
      return;
    }
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
    const fileBuffer = XLSX.write(workBook, {type: 'buffer'});
    await this.exportHandler(fileBuffer);
  }
}

import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import * as excelJs from 'exceljs';
import {ExportHandlerServiceBindings} from '../keys';
import {AuditLogExportFn, ExportHandlerFn} from '../types';

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

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);

    // Add column headers
    worksheet.addRow(worksheetColumnNames);

    // Add data rows
    dataValues.forEach(values => {
      worksheet.addRow(values);
    });

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    await this.exportHandler(buffer);
  }
}

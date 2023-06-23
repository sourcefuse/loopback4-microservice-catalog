import {injectable, BindingScope, Provider, inject} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import * as XLSX from 'xlsx';
import {ExcelProcessingFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ExcelProcessingProvider implements Provider<ExcelProcessingFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
  ) {}

  value() {
    return async (workbook: XLSX.WorkBook) => {
      await this.excelProcessing(workbook);
    };
  }
  async excelProcessing(workbook: XLSX.WorkBook) {
    // Perform your processing logic on the Excel workbook
    this.logger.info('Processing Excel workbook');
  }
}

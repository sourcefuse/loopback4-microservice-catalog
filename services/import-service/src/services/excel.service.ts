import {BindingScope, injectable, service} from '@loopback/core';
import {WorkSheet} from 'xlsx';
import {MessageData} from '../types';
import {FileHelperService} from './file-helper.service';
const XLSX = require('xlsx');

// MAKE CONFIGURABLE
export const batchSize = 30; //number of records/rows in each batch MAKE CONFIGURABLE

@injectable({scope: BindingScope.TRANSIENT})
export class ExcelService {
  constructor(
    @service(FileHelperService)
    private readonly fileHelperService: FileHelperService,
  ) {}

  async getData(fileKey: string, types: Record<string, string>) {
    console.time('parsing'); //config.filekey
    const fileResponse = await this.fileHelperService.getObject(fileKey);
    const file = await XLSX.read(fileResponse, {
      type: 'buffer',
      cellStyles: true,
    });
    const sheets: WorkSheet[] = Object.values(file.Sheets);
    const batches: MessageData[] = [];
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    sheets.forEach(async (sheet: WorkSheet) => {
      const sheetData = await this.getSheetData(sheet);
      batches.push({rows: sheetData, types});
    });
    return batches;
  }
  async getSheetData(sheetName: WorkSheet) {
    const rows: string[] = [];
    const sheetData = XLSX.utils.sheet_to_json(sheetName, {
      raw: false,
    });
    sheetData.splice(0, 1);
    for await (const chunk of this.getSheetGenerator(sheetData)) {
      rows.push(...chunk);
    }
    return rows;
  }
  async *getSheetGenerator(sheetData: string[]) {
    let OutlineLevel = 0;

    for (
      let i = 1;
      OutlineLevel < sheetData.length;
      OutlineLevel += batchSize, i++
    ) {
      yield sheetData.slice(OutlineLevel, OutlineLevel + batchSize);
    }
  }
}

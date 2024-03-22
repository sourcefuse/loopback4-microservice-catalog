import {BindingScope, injectable, service} from '@loopback/core';
import {WorkSheet} from 'xlsx';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batches: any[] = [];

    sheets.forEach((sheet: WorkSheet) => {
      const rowOutlineLevel: number[] = [];

      //find max outline level
      let maxOutlineLevel = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sheet['!rows']?.forEach((row: any, index: number) => {
        rowOutlineLevel[index] = row.level;
        if (row.level > maxOutlineLevel) {
          maxOutlineLevel = row.level;
        }
      });
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
      });

      for (
        let currentOutlineLevel = 1;
        currentOutlineLevel <= maxOutlineLevel;
        currentOutlineLevel++
      ) {
        batches[currentOutlineLevel] = batches[currentOutlineLevel] ?? [];

        const currentLevelRowData: string[] = [];

        for (const [index, rowData] of sheetData.entries()) {
          if (index === 0) {
            continue;
          }

          if (rowOutlineLevel[index] === currentOutlineLevel) {
            currentLevelRowData.push(rowData);
          }
        }

        for (let i = 0; i < currentLevelRowData.length; i += batchSize) {
          const batch = currentLevelRowData.slice(i, i + batchSize);
          batches[currentOutlineLevel].push({rows: batch, types});
        }
      }
    });
    return batches;
  }
}

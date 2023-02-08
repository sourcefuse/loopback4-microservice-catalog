import {BindingScope, injectable, service} from '@loopback/core';
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
    const sheets = Object.values(file.Sheets);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batches: {rows: any[]; types: Record<string, string>}[][] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sheets.forEach((sheet: any) => {
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

      console.log('max outline level ', maxOutlineLevel);
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
      });

      let currentOutlineLevel = 0;
      //make batches according to levels
      while (currentOutlineLevel <= maxOutlineLevel) {
        batches[currentOutlineLevel] = batches[currentOutlineLevel] ?? [];
        const currentLevelRowData = sheetData.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (rowData: any, index: number) => {
            //assuming first row to be header row
            if (rowOutlineLevel[index + 1] === currentOutlineLevel) {
              return rowData;
            }
          },
        );
        //make batches
        for (let i = 0; i < currentLevelRowData.length; i += batchSize) {
          const batch = currentLevelRowData.slice(i, i + batchSize);
          batches[currentOutlineLevel].push({rows: batch, types});
        }
        currentOutlineLevel++;
      }
    });
    console.timeLog('parsing');

    console.log('parsing complete');
    return batches;
  }
}

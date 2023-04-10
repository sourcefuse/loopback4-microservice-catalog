import {Getter, extensionPoint, extensions} from '@loopback/core';
import {AuditLog} from '../models';
import {COLUMN_EXTENSION_POINT_NAME, IColumnHandler} from '../types';

@extensionPoint(COLUMN_EXTENSION_POINT_NAME)
export class ExportColumnsBuilderService {
  constructor(
    @extensions() private getExportColumns: Getter<IColumnHandler[]>,
  ) {}

  // to define the column names of the exported file
  async exportColumnNames(): Promise<string[]> {
    const worksheetColumnNames: string[] = [];
    const newColumns = await this.getExportColumns();
    for (const column of newColumns) {
      worksheetColumnNames.push(column.columnName);
    }
    return worksheetColumnNames;
  }

  // to calculate the value of the export column
  async columnValueBuilder(auditLog: AuditLog): Promise<string[]> {
    let columnData = '';
    const rowData: string[] = [];
    const newColumns = await this.getExportColumns();
    for (const column of newColumns)
      if (column) {
        columnData = column.columnValueBuilder(auditLog);
        rowData.push(columnData);
      } else {
        throw new Error('columns not defined');
      }
    return rowData;
  }
}

import {CDC} from './cdc.interface';
import {PermissionModel} from './permission-model.interface';

export interface IngestReportRecord {
  recordType: string;
  recordId: string;
  timestamp: Date;
  cdc?: CDC;
  permission?: PermissionModel;
}

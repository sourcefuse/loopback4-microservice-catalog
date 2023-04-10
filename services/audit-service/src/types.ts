// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingTemplate, extensionFor} from '@loopback/core';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';
import {AuditLog} from './models';

// sonarignore:start
export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}
export interface IDeleteLogs {
  deleteLogs(targetDirectory: string | undefined): Promise<string>;
}
export interface IExportLogsDestinationFn {
  saveLogs(filePath: string): Promise<string>;
}

// sonarignore:end

export const AuditSourceName = AuditDbSourceName;
export interface IColumnHandler {
  columnName: string;
  columnValueBuilder(auditLog: AuditLog): string;
}

export const COLUMN_EXTENSION_POINT_NAME = 'exportColumns';
/**
 * A binding template for export column extensions
 */
export const asColumnExtension: BindingTemplate = binding => {
  extensionFor(COLUMN_EXTENSION_POINT_NAME)(binding);
  binding.tag({namespace: 'exportColumns'});
};

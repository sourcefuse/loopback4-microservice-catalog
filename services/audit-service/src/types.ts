// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MITimport {BindingTemplate, extensionFor} from '@loopback/core';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';
import {AuditLog} from './models';
import {Filter} from '@loopback/repository';

// sonarignore:start
export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}

export type QuerySelectedFilesFn = (
  fileName: string,
  filter: Filter<AuditLog>,
) => Promise<AuditLog[]>;

export type ExportToCsvFn = (
  selectedAuditLogs: AuditLog[],
) => Promise<AWS.S3.ManagedUpload.SendData>;

export interface ArchiveOutput {
  message: string;
  numberOfEntriesArchived: number;
  key: string;
}
// sonarignore:end

export const AuditSourceName = AuditDbSourceName;
export interface IColumnHandler {
  columnName: string;
  columnValueBuilder(auditLog: AuditLog): string;
}

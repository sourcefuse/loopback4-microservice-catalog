// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MITimport {BindingTemplate, extensionFor} from '@loopback/core';
import {AnyObject, Filter} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';
import {AuditLog} from './models';

// sonarignore:start
export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}

export type QuerySelectedFilesFn = (
  fileName: string,
  filter: Filter<AuditLog>,
) => Promise<AuditLog[]>;

export type ExportToCsvFn = (selectedAuditLogs: AuditLog[]) => Promise<string>;

export type ExportHandlerFn = (fileBuffer: Buffer) => Promise<void>;
export type AuditLogExportFn = (data: AnyObject[]) => Promise<void>;
export type ColumnBuilderFn = (auditLogs: AuditLog[]) => Promise<AnyObject[]>;
export interface ArchiveOutput {
  message: string;
  numberOfEntriesArchived: number;
  key: string;
}
export interface ExportResponse {
  jobId?: string;
  message?: string;
}
// sonarignore:end

export const AuditSourceName = AuditDbSourceName;

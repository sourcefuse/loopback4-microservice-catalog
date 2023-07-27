// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/core';
import {
  AuditLogExportFn,
  ColumnBuilderFn,
  ExportHandlerFn,
  ExportToCsvFn,
  IAuditServiceConfig,
  QuerySelectedFilesFn,
} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';
export namespace AWSS3Bindings {
  export const Config = BindingKey.create<AwsS3Config>('sf.aws.s3.config');
}

export interface AwsS3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

export namespace AuditServiceBindings {
  export const Config = BindingKey.create<IAuditServiceConfig | null>(
    `${BINDING_PREFIX}.audit.config`,
  );
}

export namespace QuerySelectedFilesServiceBindings {
  export const QUERY_ARCHIVED_LOGS =
    BindingKey.create<QuerySelectedFilesFn | null>(
      `${BINDING_PREFIX}.audit.queryArchivedLogs`,
    );
}
export namespace ExportToCsvServiceBindings {
  export const EXPORT_LOGS = BindingKey.create<ExportToCsvFn | null>(
    `${BINDING_PREFIX}.audit.archiveLogs`,
  );
}
export namespace AuditLogExportServiceBindings {
  export const EXPORT_AUDIT_LOGS = BindingKey.create<AuditLogExportFn>(
    `${BINDING_PREFIX}.audit.exportAuditLogs`,
  );
}
export namespace ExportHandlerServiceBindings {
  export const PROCESS_FILE = BindingKey.create<ExportHandlerFn>(
    `${BINDING_PREFIX}.audit.processFile`,
  );
}
export namespace ColumnBuilderServiceBindings {
  export const COLUMN_BUILDER = BindingKey.create<ColumnBuilderFn>(
    `${BINDING_PREFIX}.audit.columnBuilder`,
  );
}

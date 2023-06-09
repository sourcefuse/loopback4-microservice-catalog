// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/core';
import {
  ExportToCsvFn,
  IAuditServiceConfig,
  QuerySelectedFilesFn,
} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

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

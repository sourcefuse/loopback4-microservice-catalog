// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IAuditServiceConfig, IExportLogsDestinationFn} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';
import {ExportColumnsBuilderService} from './services';

export namespace AuditServiceBindings {
  export const Config = BindingKey.create<IAuditServiceConfig | null>(
    `${BINDING_PREFIX}.audit.config`,
  );
}
export namespace AuditExportServiceBindings {
  export const EXPORT_COLUMN =
    BindingKey.create<ExportColumnsBuilderService | null>(
      'services.ExportColumnsBuilderService',
    );
  export const DELETE_EXPORT_LOGS = BindingKey.create<void>(
    `provider.exportLogs.delete`,
  );
  export const SAVE_EXPORT_LOGS =
    BindingKey.create<IExportLogsDestinationFn | null>(
      `provider.exportLogs.save`,
    );
}

import {CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {AuditServiceComponent as AuditServiceJugglerComponent} from './component';
import {AuditController} from './controllers/sequelize';
import {
  AuditLogExportServiceBindings,
  AuditServiceBindings,
  ColumnBuilderServiceBindings,
  ExportHandlerServiceBindings,
  ExportToCsvServiceBindings,
  QuerySelectedFilesServiceBindings,
} from './keys';

import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from './repositories/sequelize';
import {AuditLog, Job, MappingLog} from './sequelize.index';
import {
  ColumnBuilderProvider,
  ExportHandlerProvider,
  ExportToCsvProvider,
  QuerySelectedFilesProvider,
} from './services/sequelize';
import {AuditLogExportProvider} from './services/sequelize/audit-log-export.service';
import {JobProcessingService} from './services/sequelize/job-processing.service';
import {IAuditServiceConfig} from './types';

export class AuditServiceComponent extends AuditServiceJugglerComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    restApp: RestApplication,
    @inject(AuditServiceBindings.Config, {optional: true})
    auditConfig?: IAuditServiceConfig,
  ) {
    super(restApp, auditConfig);
    this.services = [
      JobProcessingService,
      AuditLogExportProvider,
      ColumnBuilderProvider,
    ];

    this.repositories = [
      AuditLogRepository,
      MappingLogRepository,
      JobRepository,
    ];

    this.models = [AuditLog, MappingLog, Job];

    this.controllers = [AuditController];
    this.providers = {
      [QuerySelectedFilesServiceBindings.QUERY_ARCHIVED_LOGS.key]:
        QuerySelectedFilesProvider,
      [ExportToCsvServiceBindings.EXPORT_LOGS.key]: ExportToCsvProvider,
      [AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS.key]:
        AuditLogExportProvider,
      [ColumnBuilderServiceBindings.COLUMN_BUILDER.key]: ColumnBuilderProvider,
      [ExportHandlerServiceBindings.PROCESS_FILE.key]: ExportHandlerProvider,
    };
  }
}

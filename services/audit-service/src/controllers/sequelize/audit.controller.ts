import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AuditLogExportServiceBindings,
  ColumnBuilderServiceBindings,
  ExportToCsvServiceBindings,
} from '../../keys';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../../repositories/sequelize';
import {JobProcessingService} from '../../services/sequelize';
import {AuditLogExportFn, ColumnBuilderFn, ExportToCsvFn} from '../../types';
import {AuditController as JugglerAuditController} from '../audit.controller';

export class AuditController extends JugglerAuditController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @repository(JobRepository)
    public jobRepository: JobRepository,
    @service(JobProcessingService)
    public jobProcessingService: JobProcessingService,
    @repository(MappingLogRepository)
    public mappingLogRepository: MappingLogRepository,
    @inject(ExportToCsvServiceBindings.EXPORT_LOGS)
    public exportToCsv: ExportToCsvFn,
    @inject(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS)
    public auditLogExportService: AuditLogExportFn,
    @inject(ColumnBuilderServiceBindings.COLUMN_BUILDER)
    public columnBuilderService: ColumnBuilderFn,
  ) {
    super(
      auditLogRepository,
      jobRepository,
      jobProcessingService,
      mappingLogRepository,
      exportToCsv,
      auditLogExportService,
      columnBuilderService,
    );
  }
}

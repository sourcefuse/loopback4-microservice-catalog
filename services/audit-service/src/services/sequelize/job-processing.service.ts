import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AuditLogExportServiceBindings,
  ColumnBuilderServiceBindings,
  QuerySelectedFilesServiceBindings,
} from '../../keys';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../../repositories/sequelize';
import {
  AuditLogExportFn,
  ColumnBuilderFn,
  QuerySelectedFilesFn,
} from '../../types';
import {JobProcessingService as JugglerJobProcessingService} from '../job-processing.service';

export class JobProcessingService extends JugglerJobProcessingService {
  constructor(
    @inject(QuerySelectedFilesServiceBindings.QUERY_ARCHIVED_LOGS)
    public querySelectedFiles: QuerySelectedFilesFn,
    @inject(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS)
    public auditLogExport: AuditLogExportFn,
    @inject(ColumnBuilderServiceBindings.COLUMN_BUILDER)
    public columnBuilder: ColumnBuilderFn,
    @repository(MappingLogRepository)
    public mappingLogRepository: MappingLogRepository,
    @repository(JobRepository)
    public jobRepository: JobRepository,
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
  ) {
    super(
      querySelectedFiles,
      auditLogExport,
      columnBuilder,
      mappingLogRepository,
      jobRepository,
      auditLogRepository,
    );
  }
}

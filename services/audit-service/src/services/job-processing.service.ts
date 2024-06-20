import {BindingScope, inject, injectable} from '@loopback/core';
import {
  AnyObject,
  EntityCrudRepository,
  Filter,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import {FileStatusKey} from '../enums/file-status-key.enum';
import {OperationKey} from '../enums/operation-key.enum';
import {
  AuditLogExportServiceBindings,
  ColumnBuilderServiceBindings,
  QuerySelectedFilesServiceBindings,
} from '../keys';
import {CustomFilter, Job, MappingLog} from '../models';
import {JobRepository, MappingLogRepository} from '../repositories';
import {
  AuditLogExportFn,
  ColumnBuilderFn,
  QuerySelectedFilesFn,
} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class JobProcessingService {
  constructor(
    @inject(QuerySelectedFilesServiceBindings.QUERY_ARCHIVED_LOGS)
    public querySelectedFiles: QuerySelectedFilesFn,
    @inject(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS)
    public auditLogExport: AuditLogExportFn,
    @inject(ColumnBuilderServiceBindings.COLUMN_BUILDER)
    public columnBuilder: ColumnBuilderFn,
    @repository(MappingLogRepository)
    public mappingLogRepository: EntityCrudRepository<MappingLog, string, {}>,
    @repository(JobRepository)
    public jobRepository: EntityCrudRepository<Job, string, {}>,
    @repository(AuditLogRepository)
    public auditLogRepository: EntityCrudRepository<AuditLog, string, {}>,
  ) {}

  async start(jobId: string) {
    const job = await this.jobRepository.findById(jobId);

    try {
      const filter: Filter<AuditLog> = (
        await this.jobRepository.findById(jobId)
      ).filterUsed;
      const customFilter = new CustomFilter();
      if (filter?.where && 'and' in filter.where) {
        const andArray = filter.where?.and;
        for (const condition of andArray) {
          if (condition.actedAt?.between) {
            const [start, end] = condition.actedAt.between;
            customFilter.date = {
              fromDate: start,
              toDate: end,
            };
          }
          if (condition.actedOn) {
            customFilter.actedOn = this.getFilter(condition.actedOn);
          }
          if (condition.actionGroup) {
            customFilter.actionGroup = this.getFilter(condition.actionGroup);
          }
          if (condition.entityId) {
            customFilter.entityId = condition.entityId;
          }
        }
      }
      const mappingLogs: MappingLog[] = await this.mappingLogRepository.find();
      const finalData: AuditLog[] = [];
      /*Creating a for loop over all the archived files*/
      for (const mappingLog of mappingLogs) {
        const filterUsed: CustomFilter = mappingLog.filterUsed as CustomFilter;
        if (
          (customFilter.actedOn == null ||
            filterUsed.actedOn == null ||
            filterUsed.actedOn === customFilter.actedOn ||
            this.haveCommonElements(
              filterUsed.actedOn,
              customFilter.actedOn,
            )) &&
          (customFilter.actionGroup == null ||
            filterUsed.actionGroup == null ||
            filterUsed.actionGroup === customFilter.actionGroup ||
            this.haveCommonElements(
              filterUsed.actionGroup,
              customFilter.actionGroup,
            )) &&
          (customFilter.entityId ??
            filterUsed.entityId ??
            filterUsed.entityId === customFilter.entityId) &&
          (customFilter.date == null ||
            filterUsed.date == null ||
            (filterUsed.date?.fromDate <= customFilter.date?.toDate &&
              filterUsed.date?.toDate >= customFilter.date?.fromDate))
        ) {
          //logs from s3
          finalData.push(
            ...(await this.querySelectedFiles(mappingLog.fileName, filter)),
          );
        }
      }
      //logs from db
      finalData.push(...(await this.auditLogRepository.find(filter)));

      if (job.operation === OperationKey.EXPORT) {
        const customColumnData = await this.columnBuilder(finalData);
        await this.auditLogExport(customColumnData);
      }
      job.status = FileStatusKey.COMPLETED;
      job.result = JSON.stringify(finalData);
      await this.jobRepository.updateById(jobId, job);
    } catch (error) {
      job.status = FileStatusKey.COMPLETED;
      await this.jobRepository.updateById(jobId, job);
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }

  getFilter(inquiredFilter: string | AnyObject): string[] {
    if (typeof inquiredFilter === 'string') {
      return [inquiredFilter];
    } else return inquiredFilter.inq;
  }

  haveCommonElements(arr1: string[], arr2: string[]): boolean {
    return arr1.some(item => arr2.includes(item));
  }
}

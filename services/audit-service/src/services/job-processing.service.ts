import {injectable, BindingScope, inject} from '@loopback/core';
import {QuerySelectedFilesServiceBindings} from '../keys';
import {repository, Filter} from '@loopback/repository';
import {JobRepository, MappingLogRepository} from '../repositories';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import {CustomFilter, Job, MappingLog} from '../models';
import {FileStatusKey} from '../enums/file-status-key.enum';
import {HttpErrors} from '@loopback/rest';
import {QuerySelectedFilesFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class JobProcessingService {
  constructor(
    @inject(QuerySelectedFilesServiceBindings.QUERY_ARCHIVED_LOGS)
    public querySelectedFiles: QuerySelectedFilesFn,
    @repository(MappingLogRepository)
    public mappingLogRepository: MappingLogRepository,
    @repository(JobRepository)
    public jobRepository: JobRepository,
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
  ) {}

  async start(jobId: string) {
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
            customFilter.actedOn = condition.actedOn;
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
            filterUsed.actedOn === customFilter.actedOn) &&
          (customFilter.entityId ||
            filterUsed.entityId ||
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
      const newJob = new Job({
        id: jobId,
        filterUsed: filter,
        status: FileStatusKey.Completed,
        result: JSON.stringify(finalData),
      });

      await this.jobRepository.updateById(jobId, newJob);
    } catch (error) {
      const newJob = new Job({
        id: jobId,
        status: FileStatusKey.Failed,
        result: '',
      });
      await this.jobRepository.updateById(jobId, newJob);
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }
}

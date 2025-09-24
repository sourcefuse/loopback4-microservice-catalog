// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  EntityCrudRepository,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  ITenantUtilitiesConfig,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  TenantUtilitiesBindings,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {inject, service} from '@loopback/core';
import {FileStatusKey} from '../enums/file-status-key.enum';
import {OperationKey} from '../enums/operation-key.enum';
import {PermissionKey} from '../enums/permission-key.enum';
import {
  AuditLogExportServiceBindings,
  ColumnBuilderServiceBindings,
  ExportToCsvServiceBindings,
} from '../keys';
import {CustomFilter} from '../models';
import {AuditLog, Job, MappingLog} from '../models/tenant-support';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../repositories';
import {JobProcessingService} from '../services';
import {
  ArchiveOutput,
  AuditLogExportFn,
  ColumnBuilderFn,
  ExportResponse,
  ExportToCsvFn,
} from '../types';
import {constructWhere} from '../utils/construct-where';
const basePath = '/audit-logs';

export class AuditController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: EntityCrudRepository<AuditLog, string, {}>,
    @repository(JobRepository)
    public jobRepository: EntityCrudRepository<Job, string, {}>,
    @service(JobProcessingService)
    public jobProcessingService: JobProcessingService,
    @repository(MappingLogRepository)
    public mappingLogRepository: EntityCrudRepository<MappingLog, string, {}>,
    @inject(ExportToCsvServiceBindings.EXPORT_LOGS)
    public exportToCsv: ExportToCsvFn,
    @inject(AuditLogExportServiceBindings.EXPORT_AUDIT_LOGS)
    public auditLogExportService: AuditLogExportFn,
    @inject(ColumnBuilderServiceBindings.COLUMN_BUILDER)
    public columnBuilderService: ColumnBuilderFn,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @inject(TenantUtilitiesBindings.Config, {optional: true})
    private readonly config?: ITenantUtilitiesConfig,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateAudit, PermissionKey.CreateAuditNum],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuditLog model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AuditLog)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AuditLog, {
            title: 'NewAuditLog',
            exclude: ['id', 'tenantId'],
          }),
        },
      },
    })
    auditLog: Omit<AuditLog, 'id' | 'tenantId'>,
  ): Promise<AuditLog> {
    if (!this.config?.useSingleTenant) {
      auditLog.tenantId = this.currentUser.tenantId;
    }
    return this.auditLogRepository.create(auditLog);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewAudit, PermissionKey.ViewAuditNum],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuditLog model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(AuditLog) where?: Where<AuditLog>): Promise<Count> {
    return this.auditLogRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewAudit, PermissionKey.ViewAuditNum],
  })
  @get(`${basePath}/jobs/{jobId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of AuditLog model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Job, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async jobStatus(
    @param.path.string('jobId')
    jobId: string,
  ): Promise<Job> {
    const job: Job = await this.jobRepository.findById(jobId);
    job.result = JSON.parse(job.result);
    await this.jobRepository.deleteById(jobId);
    return job;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewAudit, PermissionKey.ViewAuditNum],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of AuditLog model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(AuditLog, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    // sonarignore:start
    @param.query.boolean('includeArchivedLogs')
    includeArchivedLogs: boolean,
    @param.filter(AuditLog) filter?: Filter<AuditLog>,
  ): Promise<AuditLog[] | object> {
    if (includeArchivedLogs) {
      const job = await this.jobRepository.create({
        filterUsed: filter,
        status: FileStatusKey.PENDING,
        operation: OperationKey.QUERY,
      });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.jobProcessingService.start(job.getId());

      return {jobId: job.getId()};
    } else {
      const result = await this.auditLogRepository.find(filter);
      return result;
    }
    // sonarignore:end
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewAudit, PermissionKey.ViewAuditNum],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuditLog model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(AuditLog, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(AuditLog, {exclude: 'where'})
    filter?: FilterExcludingWhere<AuditLog>,
  ): Promise<AuditLog> {
    return this.auditLogRepository.findById(id, filter);
  }
  @authorize({
    permissions: [PermissionKey.ArchiveLogs, PermissionKey.ArchiveLogsNum],
  })
  @authenticate(STRATEGY.BEARER)
  @post(`${basePath}/archive`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Archive the Logs',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              message: 'Logs archived successfully',
            },
          },
        },
      },
    },
  })
  @response(STATUS_CODE.OK, {
    description: 'Archive logs status',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
            numberOfEntriesArchived: {type: 'number'},
            file: {type: 'string'},
          },
        },
      },
    },
  })
  async archive(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomFilter, {
            title: 'CustomFilter',
            exclude: [],
          }),
        },
      },
    })
    customFilter: CustomFilter,
  ): Promise<ArchiveOutput> {
    const where = await constructWhere(customFilter);
    let selectedAuditLogs = await this.auditLogRepository.find({
      where: where,
    });
    if (!selectedAuditLogs.length) {
      return {
        message: `No entry selected`,
        numberOfEntriesArchived: 0,
        key: '',
      };
    }

    /*If deleted is true then previous logs for that
    particular entityId shall also be deleted*/
    const selectedAuditLogsOld = selectedAuditLogs;
    if (customFilter.deleted === true) {
      for (const selectedAuditLog of selectedAuditLogsOld) {
        const noDuplicateCondition: Where = {
          and: [
            {entityId: selectedAuditLog.entityId},
            {id: {neq: selectedAuditLog.id}},
          ],
        };
        selectedAuditLogs = selectedAuditLogs.concat(
          await this.auditLogRepository.find({where: noDuplicateCondition}),
        );
      }
    }
    /*There is a chance that during the above for loop, duplicate entries might have been
    concatenated in the selectedAuditLogs array.Therefore filter the array to keep only
    unique rows based on the 'id' column.
    Example
    id  entityId     after
    1     a        deleted:true
    2     a        deleted:false
    3     a           null
    Now if in our filter deleted is true then initially selectedAuditLogs will have
    id->1,3 . Now the for loop will run for id->1 and it will concatenate id->2,3.
    Then the for loop will run for id->3 and it will concatenate id->1,2. Now eventually
    selectedAuditLogs will have duplicate entries for id->1,2,3 which is why we are filtering
    selectedAuditLogs keeping 'id' unique
    */
    const uniqueIds = new Set<string>();
    selectedAuditLogs = selectedAuditLogs.filter(log => {
      if (log.id && !uniqueIds.has(log.id)) {
        uniqueIds.add(log.id);
        return true;
      }
      return false;
    });
    const uploadKey = await this.exportToCsv(selectedAuditLogs);
    /* Creating a mapping log to store the filename and filterused during the archival process*/
    const mappingLog = new MappingLog();
    mappingLog.filterUsed = customFilter;
    mappingLog.fileName = uploadKey;
    await this.mappingLogRepository.create(mappingLog);
    /* After successful uploading of csv file and creation of mapping logs we need
    to delete the selected logs from the primary databse */
    await this.auditLogRepository.deleteAll(where);
    if (customFilter.deleted === true) {
      for (const selectedAuditLog of selectedAuditLogsOld) {
        const deleteCondition: Where = {
          and: [
            {entityId: selectedAuditLog.entityId},
            {id: {neq: selectedAuditLog.id}},
          ],
        };
        await this.auditLogRepository.deleteAll(deleteCondition);
      }
    }

    return {
      message: 'Entries archived successfully',
      numberOfEntriesArchived: selectedAuditLogs.length,
      key: uploadKey,
    };
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ExportLogs, PermissionKey.ExportAuditNum],
  })
  @get(`${basePath}/export`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Responds with jobId if includeArchiveLogs  is true or the success message otherwise.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              properties: {
                jobId: {type: 'string'},
                message: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async export(
    @param.query.boolean('includeArchivedLogs')
    includeArchivedLogs: boolean,
    @param.filter(AuditLog) filter?: Filter<AuditLog>,
  ): Promise<ExportResponse> {
    if (includeArchivedLogs) {
      const job = await this.jobRepository.create({
        filterUsed: filter,
        status: FileStatusKey.PENDING,
        operation: OperationKey.EXPORT,
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.jobProcessingService.start(job.getId());

      return {jobId: job.getId()};
    } else {
      const result = await this.auditLogRepository.find(filter);
      if (result.length === 0) {
        return {message: 'No data to be exported'};
      }
      const customColumnData = await this.columnBuilderService(result);
      await this.auditLogExportService(customColumnData);
      return {message: 'Audit logs exported successfully.'};
    }
  }
}

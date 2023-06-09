// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {PermissionKey} from '../enums/permission-key.enum';
import {AuditLog, Job} from '../models';
import {AuditLogRepository, JobRepository} from '../repositories';
import {service} from '@loopback/core';
import {JobProcessingService} from '../services';
import {FileStatusKey} from '../enums/file-status-key.enum';

const basePath = '/audit-logs';

export class AuditController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @repository(JobRepository)
    public jobRepository: JobRepository,
    @service(JobProcessingService)
    public jobProcessingService: JobProcessingService,
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
            exclude: ['id'],
          }),
        },
      },
    })
    auditLog: Omit<AuditLog, 'id'>,
  ): Promise<AuditLog> {
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
    @param.query.boolean('includeArchivedLogs')
    includeArchivedLogs: boolean,
    @param.filter(AuditLog) filter?: Filter<AuditLog>,
  ): Promise<AuditLog[] | object> {
    if (includeArchivedLogs) {
      const job = (await this.jobRepository.create({
        filterUsed: filter,
        status: FileStatusKey.Pending,
      })) as Job;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.jobProcessingService.start(job.getId());

      return {jobId: job.getId()};
    } else {
      const result = await this.auditLogRepository.find(filter);
      return result;
    }
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
}

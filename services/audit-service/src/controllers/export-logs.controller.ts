import {service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {param, get} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  CONTENT_TYPE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {AuditLog} from '../models';
import {AuditLogRepository} from '../repositories';
import {AuditLogExportService} from '../services';

const basePath = '/export-logs';

export class ExportLogsController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @service(AuditLogExportService)
    public auditLogExportService: AuditLogExportService,
  ) {}

  @authorize({
    permissions: [PermissionKey.ExportLogs, PermissionKey.ExportLogsNum],
  })
  @authenticate(STRATEGY.BEARER)
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Create Export Logs',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              message: 'Export Logs created successfully',
            },
          },
        },
      },
    },
  })
  async exportAuditLogs(
    @param.filter(AuditLog) filter?: Filter<AuditLog>,
  ): Promise<{message: string}> {
    const selectedAuditLogs = await this.auditLogRepository.find(filter);
    await this.auditLogExportService.exportToExcel(selectedAuditLogs);
    return {message: 'Export Logs created successfully!!'};
  }
}

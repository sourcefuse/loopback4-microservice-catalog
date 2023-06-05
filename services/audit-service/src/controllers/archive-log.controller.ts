import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {post, getModelSchemaRef, requestBody, response} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {CustomFilter, MappingLog} from '../models';
import {AuditLogRepository, MappingLogRepository} from '../repositories';
import {constructWhere} from '../utils/construct-where';
import {ExportToCsvServiceBindings} from '../keys';
import {ArchiveOutput, ExportToCsvFn} from '../types';

export class ArchiveLogController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @repository(MappingLogRepository)
    public mappingLogRepository: MappingLogRepository,
    @inject(ExportToCsvServiceBindings.EXPORT_LOGS)
    public exportToCsv: ExportToCsvFn,
  ) {}

  @authorize({
    permissions: [PermissionKey.ArchiveLogs, PermissionKey.ArchiveLogsNum],
  })
  @authenticate(STRATEGY.BEARER)
  @post('/audit-logs/archive', {
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
    description: 'AuditLog model instance',
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
    if (!selectedAuditLogs) {
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
    const s3Upload = await this.exportToCsv(selectedAuditLogs);
    /* Creating a mapping log to store the filename and filterused during the archival process*/
    const mappingLog = new MappingLog();
    mappingLog.filterUsed = customFilter;
    mappingLog.fileName = s3Upload.Key;
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
      key: s3Upload.Key,
    };
  }
}

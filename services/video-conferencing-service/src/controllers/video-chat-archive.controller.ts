import {inject} from '@loopback/core';
import {del, get, param, HttpErrors} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {VideoChatInterface} from '../types';
import {VideoChatBindings} from '../keys';
import { STATUS_CODE, CONTENT_TYPE } from '@sourceloop/core';
import { repository } from '@loopback/repository';
import { VideoChatSessionRepository, AuditLogsRepository } from '../repositories';
import moment from 'moment';

export class VideoChatArchiveController {
  constructor(
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.GetArchives])
  @get('/archives/{archiveId}', {
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getArchive(@param.path.string('archiveId') archiveId: string) {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      }
    });
    if (!archiveExists) {
      this.auditLogRepository.create({
        action: 'archive',
        actionType: 'getArchive',
        before: { archiveId },
        after: { errorMessage: 'Archive Not Found '},
        actedAt: moment().format(), 
      });
      throw new HttpErrors.NotFound('Archive Not Found');
    }
    return this.videoChatProvider.getArchives(archiveId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.GetArchives])
  @get('/archives', {
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getArchives() {
    return this.videoChatProvider.getArchives(null);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.DeleteArchive])
  @del('/archives/{archiveId}', {
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.TEXT]: {
            schema: {
              type: 'text',
            },
          },
        },
      },
    },
  })
  async deleteArchive(
    @param.path.string('archiveId') archiveId: string,
  ): Promise<void> {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      }
    });
    if (!archiveExists) {
      this.auditLogRepository.create({
        action: 'archive',
        actionType: 'getArchive',
        before: { archiveId },
        after: { errorMessage: 'Archive Not Found '},
        actedAt: moment().format(), 
      });
      throw new HttpErrors.NotFound('Archive Not Found');
    }
    return this.videoChatProvider.deleteArchive(archiveId);
  }
}

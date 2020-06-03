import {inject} from '@loopback/core';
import {del, get, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';
import { STATUS_CODE, CONTENT_TYPE } from '@sourcefuse-service-catalog/core';
import {VideoChatBindings, VideoChatInterface} from '../types';
import {HttpErrors} from '@loopback/rest';

export class VideoChatArchiveController {
  constructor(
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
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
  async getArchive(@param.path.string('archiveId') archiveId: string | null) {
    if (!archiveId) {
      throw new HttpErrors.BadRequest('Archive Id is Required');
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
    if (!archiveId) {
      throw new HttpErrors.BadRequest('Archive Id is Required');
    }
    await this.videoChatProvider.deleteArchive(archiveId);
  }
}
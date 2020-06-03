import {inject} from '@loopback/core';
import {del, get, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {CONTENT_TYPE, STATUS_CODE} from '../enums';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {VideoChatInterface} from '../types';
import {VideoChatBindings} from '../keys';

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
    await this.videoChatProvider.getArchives(archiveId);
  }
}

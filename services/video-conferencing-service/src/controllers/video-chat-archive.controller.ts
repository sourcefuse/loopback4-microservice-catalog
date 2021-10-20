import {inject} from '@loopback/core';
import {del, get, param, put, requestBody} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {S3TargetOptions, AzureTargetOptions} from '../types';

import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {ChatArchiveService} from '../services/chat-archive.service';
import {ServiceBindings} from '../keys';

export class VideoChatArchiveController {
  constructor(
    @inject(ServiceBindings.ArchiveChatService)
    public chatArchiveService: ChatArchiveService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.GetArchives]})
  @get('/archives/{archiveId}', {
    description:
      'Used to fetch a specific archive w.r.t archiveId. If archive is not present, it will throw HTTP Not Found Error.',
    security: OPERATION_SECURITY_SPEC,
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
    return this.chatArchiveService.getArchive(archiveId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.GetArchives]})
  @get('/archives', {
    description:
      'Used to fetch a list of archives (meetings that were recorded).',
    security: OPERATION_SECURITY_SPEC,
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
    return this.chatArchiveService.getArchives();
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.DeleteArchive]})
  @del('/archives/{archiveId}', {
    description:
      'Used to delete a specific archive w.r.t archiveId. If archive is not present, it will throw HTTP Not Found Error.',
    security: OPERATION_SECURITY_SPEC,
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
    return this.chatArchiveService.deleteArchive(archiveId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.SetUploadTarget]})
  @put('/archives/storage-target', {
    description:
      'Configures custom storage target to a custom Amazon s3 bucket or Microsoft Azure Storage.',
    security: OPERATION_SECURITY_SPEC,
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
  async setUploadTarget(
    @requestBody() body: S3TargetOptions | AzureTargetOptions,
  ): Promise<void> {
    return this.chatArchiveService.setUploadTarget(body);
  }
  // TO-DO: will do modifications later
  // @authenticate(STRATEGY.BEARER)
  // @authorize({permissions:[PermissionKeys.SetUploadTarget]})
  // @del('/archives/storage-target', {
  //   responses: {
  //     [STATUS_CODE.OK]: {
  //       content: {
  //         [CONTENT_TYPE.TEXT]: {
  //           schema: {
  //             type: 'text',
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async deleteCustomStorageTarget() {
  //   return this.videoChatProvider.deleteUploadTarget();
  // }
}

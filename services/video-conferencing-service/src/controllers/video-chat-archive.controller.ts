import {inject} from '@loopback/core';
import {param, HttpErrors, requestBody} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {
  VideoChatInterface,
  S3TargetOptions,
  AzureTargetOptions,
} from '../types';
import {VideoChatBindings} from '../keys';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  sourceloopGet,
  sourceloopDelete,
  sourceloopPut,
} from '@sourceloop/core';
import {repository} from '@loopback/repository';
import {VideoChatSessionRepository, AuditLogsRepository} from '../repositories';
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

  @sourceloopGet('/archives/{archiveId}', {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.GetArchives]})
  async getArchive(@param.path.string('archiveId') archiveId: string) {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      },
    });
    if (!archiveExists) {
      const errorMessage = 'Archive Not Found';
      await this.auditLogRepository.create({
        action: 'archive',
        actionType: 'getArchive',
        before: {archiveId},
        after: {errorMessage: errorMessage},
        actedAt: moment().format(),
      });
      throw new HttpErrors.NotFound(errorMessage);
    }
    return this.videoChatProvider.getArchives(archiveId);
  }

  @sourceloopGet('/archives', {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.GetArchives]})
  async getArchives() {
    return this.videoChatProvider.getArchives(null);
  }

  @sourceloopDelete('/archives/{archiveId}', {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.DeleteArchive]})
  async deleteArchive(
    @param.path.string('archiveId') archiveId: string,
  ): Promise<void> {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      },
    });
    if (!archiveExists) {
      const errorMessage = 'Archive Not Found';
      await this.auditLogRepository.create({
        action: 'archive',
        actionType: 'getArchive',
        before: {archiveId},
        after: {errorMessage: errorMessage},
        actedAt: moment().format(),
      });
      throw new HttpErrors.NotFound(errorMessage);
    }
    return this.videoChatProvider.deleteArchive(archiveId);
  }

  @sourceloopPut('/archives/storage-target', {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.SetUploadTarget]})
  async setUploadTarget(
    @requestBody() body: S3TargetOptions | AzureTargetOptions,
  ): Promise<void> {
    const {accessKey, secretKey, bucket} = body as S3TargetOptions;
    const {accountName, accountKey, container} = body as AzureTargetOptions;
    if (
      !(accessKey && secretKey && bucket) &&
      !(accountName && accountKey && container)
    ) {
      throw new HttpErrors.BadRequest(
        'Missing s3/azure credentials. Please check request body',
      );
    }
    await this.videoChatProvider.setUploadTarget(body);
  }
  // TO-DO: will do modifications later
  // @authenticate(STRATEGY.BEARER)
  // @authorize({permissions:[PermissionKeys.SetUploadTarget]})
  // @sourceloopDelete('/archives/storage-target', {
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

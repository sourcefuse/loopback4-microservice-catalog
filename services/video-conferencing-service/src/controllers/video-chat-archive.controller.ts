import {inject} from '@loopback/core';
import {del, get, param, HttpErrors, put, requestBody} from '@loopback/rest';
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
    return this.videoChatProvider.getArchives(null);
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

import {injectable, inject, BindingScope} from '@loopback/core';

import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {VideoChatBindings} from '../keys';
import {VideoChatSessionRepository} from '../repositories';
import {
  AzureTargetOptions,
  S3TargetOptions,
  VideoChatInterface,
} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ChatArchiveService {
  constructor(
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
  ) {}

  async getArchive(archiveId: string) {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      },
    });
    if (!archiveExists) {
      const errorMessage = 'Archive Not Found';

      throw new HttpErrors.NotFound(errorMessage);
    }
    return this.videoChatProvider.getArchives(archiveId);
  }

  async getArchives() {
    return this.videoChatProvider.getArchives(null);
  }

  async deleteArchive(archiveId: string): Promise<void> {
    const archiveExists = await this.videoChatSessionRepository.findOne({
      where: {
        archiveId: archiveId,
      },
    });
    if (!archiveExists) {
      const errorMessage = 'Archive Not Found';

      throw new HttpErrors.NotFound(errorMessage);
    }
    return this.videoChatProvider.deleteArchive(archiveId);
  }

  async setUploadTarget(
    body: S3TargetOptions | AzureTargetOptions,
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
}

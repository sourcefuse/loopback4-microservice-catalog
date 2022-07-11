// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {injectable, inject, BindingScope} from '@loopback/core';

import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ExternalStorageOptions} from '..';

import {VideoChatBindings} from '../keys';
import {VideoChatSessionRepository} from '../repositories';
import {VideoChatInterface} from '../types';

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

  async setUploadTarget(body: ExternalStorageOptions): Promise<void> {
    await this.videoChatProvider.setUploadTarget(body);
  }
}

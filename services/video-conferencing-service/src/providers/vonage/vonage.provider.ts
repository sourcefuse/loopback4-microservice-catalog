// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, service} from '@loopback/core';
import {VonageSessionWebhookPayload} from '.';
import {VideoChatFeatures} from '../..';
import {
  ArchiveResponse,
  ArchiveResponseList,
  SessionResponse,
} from '../../types';
import {
  VonageVideoChat,
  VonageMeetingOptions,
  VonageMeetingResponse,
  VonageSessionOptions,
  VonageS3TargetOptions,
  VonageAzureTargetOptions,
} from './types';

import {VonageService} from './vonage.service';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @service(VonageService)
    private readonly vonageService: VonageService,
  ) {}
  value() {
    return {
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions,
      ): Promise<VonageMeetingResponse> =>
        this.vonageService.getMeetingLink(meetingOptions),

      getToken: async (
        sessionId: string,
        options: VonageSessionOptions,
      ): Promise<SessionResponse> =>
        this.vonageService.getToken(sessionId, options),
      getArchives: async (
        archiveId: string | null,
      ): Promise<ArchiveResponse | ArchiveResponseList> =>
        this.vonageService.getArchives(archiveId),

      deleteArchive: async (archiveId: string) => {
        await this.vonageService.deleteArchive(archiveId);
      },
      setUploadTarget: async (
        storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
      ): Promise<void> => {
        await this.vonageService.setUploadTarget(storageConfig);
      },

      getFeatures: (): VideoChatFeatures => this.vonageService.getFeatures(),
      checkWebhookPayload: (
        webhookPayload: VonageSessionWebhookPayload,
      ): Promise<void> =>
        this.vonageService.checkWebhookPayload(webhookPayload),
    };
  }
}

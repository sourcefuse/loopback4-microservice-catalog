import {Provider, service} from '@loopback/core';
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

import {HttpErrors} from '@loopback/rest';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @service(VonageService)
    private readonly vonageService: VonageService,
  ) {}
  value() {
    return {
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions,
      ): Promise<VonageMeetingResponse> => {
        return this.vonageService.getMeetingLink(meetingOptions);
      },
      getToken: async (
        sessionId: string,
        options: VonageSessionOptions,
      ): Promise<SessionResponse> => {
        return this.vonageService.getToken(sessionId, options);
      },
      getArchives: async (
        archiveId: string | null,
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        return this.vonageService.getArchives(archiveId);
      },
      deleteArchive: async (archiveId: string) => {
       await this.vonageService.deleteArchive(archiveId);
      },
      setUploadTarget: async (
        storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
      ): Promise<void> => {
        await this.vonageService.setUploadTarget(storageConfig);
      },
    };
  }
}

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
        try {
          return await this.vonageService.getMeetingLink(meetingOptions);
        } catch (error) {
          throw new HttpErrors.InternalServerError('Error creating session');
        }
      },
      getToken: async (
        sessionId: string,
        options: VonageSessionOptions,
      ): Promise<SessionResponse> => {
        try {
          return await this.vonageService.getToken(sessionId, options);
        } catch (error) {
          throw new HttpErrors.InternalServerError(
            'Error occured while generating Token',
          );
        }
      },
      getArchives: async (
        archiveId: string | null,
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        try {
          return await this.vonageService.getArchives(archiveId);
        } catch (error) {
          throw new HttpErrors.InternalServerError(
            'Error occured while fetching archive(s)',
          );
        }
      },
      deleteArchive: async (archiveId: string) => {
        try {
          await this.vonageService.deleteArchive(archiveId);
        } catch (error) {
          throw new HttpErrors.InternalServerError(
            'Error occured while deleting an archive',
          );
        }
      },
      setUploadTarget: async (
        storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
      ): Promise<void> => {
        try {
          await this.vonageService.setUploadTarget(storageConfig);
        } catch (error) {
          throw new HttpErrors.InternalServerError(
            'Error Occured while setting storage target',
          );
        }
      },
    };
  }
}

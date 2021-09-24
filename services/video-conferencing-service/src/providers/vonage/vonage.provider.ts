import { Provider, service } from "@loopback/core";
import {
  ArchiveResponse,
  ArchiveResponseList,
  SessionResponse,
} from "../../types";
import {
  VonageVideoChat,
  VonageMeetingOptions,
  VonageMeetingResponse,
  VonageSessionOptions,
  VonageS3TargetOptions,
  VonageAzureTargetOptions,
} from "./types";

import { VonageService } from "./vonage.service";



export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @service(VonageService)
    private readonly vonageService: VonageService
  ) {}
  value() {
    return {
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions): Promise<VonageMeetingResponse> => this.vonageService.getMeetingLink(meetingOptions),
      
      getToken: async (
        sessionId: string,
        options: VonageSessionOptions
      ): Promise<SessionResponse> => this.vonageService.getToken(sessionId, options),
      
      getArchives: async (
        archiveId: string | null
      ): Promise<ArchiveResponse | ArchiveResponseList> => this.vonageService.getArchives(archiveId),
      
      deleteArchive: async (archiveId: string) => {
        await this.vonageService.deleteArchive(archiveId);
      },
      setUploadTarget: async (
        storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions
      ): Promise<void> => {
        await this.vonageService.setUploadTarget(storageConfig);
      },
    };
  }
}

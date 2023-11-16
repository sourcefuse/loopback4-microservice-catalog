// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, service} from '@loopback/core';
import {
  ArchiveResponse,
  MeetingOptions,
  SessionResponse,
  VideoChatFeatures,
} from '../../../types';
import {TwilioService} from './twilio.service';
import {
  TwilioMeetingResponse,
  TwilioS3TargetOptions,
  TwilioSessonOptions,
  TwilioVideoChat,
  TwilioWebhookPayload,
} from './types';
export class TwilioProvider implements Provider<TwilioVideoChat> {
  constructor(
    @service(TwilioService) private readonly twilioService: TwilioService,
  ) {}

  value() {
    return {
      getToken: (
        sessionId: string,
        options: TwilioSessonOptions,
      ): Promise<SessionResponse> =>
        this.twilioService.getToken(sessionId, options),

      getMeetingLink: async (
        meetingOptions: MeetingOptions,
      ): Promise<TwilioMeetingResponse> =>
        this.twilioService.getMeetingLink(meetingOptions),

      getArchives: async (archiveId: string | null): Promise<ArchiveResponse> =>
        this.twilioService.getArchives(archiveId),

      deleteArchive: async (archiveId: string) => {
        await this.twilioService.deleteArchive(archiveId);
      },
      setUploadTarget: async (
        storageConfig: TwilioS3TargetOptions,
      ): Promise<void> => {
        await this.twilioService.setUploadTarget(storageConfig);
      },

      getFeatures: (): VideoChatFeatures => this.twilioService.getFeatures(),

      checkWebhookPayload: (
        webhookPayload: TwilioWebhookPayload,
      ): Promise<void> =>
        this.twilioService.checkWebhookPayload(webhookPayload),
    };
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, service} from '@loopback/core';
import {TwilioS3TargetOptions, TwilioWebhookPayload} from '.';
import {TwilioMeetingResponse, TwilioSessonOptions} from '..';
import {
  ArchiveResponse,
  MeetingOptions,
  SessionResponse,
  VideoChatFeatures,
} from '../..';
import {TwilioService} from './twilio.service';
import {TwilioVideoChat} from './types';
export class TwilioProvider implements Provider<TwilioVideoChat> {
  constructor(
    @service(TwilioService) private readonly twilioService: TwilioService,
  ) {}

  /**
   * The function returns an object with methods for interacting with Twilio services such as getting
   * tokens, meeting links, archives, setting upload targets, getting features, and checking webhook
   * payloads.
   * @returns The `value()` function returns an object with several methods related to interacting with
   * Twilio services. These methods include `getToken`, `getMeetingLink`, `getArchives`,
   * `deleteArchive`, `setUploadTarget`, `getFeatures`, and `checkWebhookPayload`. Each method performs
   * a specific action such as retrieving a token, getting a meeting link, fetching archives, deleting
   * an archive, setting
   */
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

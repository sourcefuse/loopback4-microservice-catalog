// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import twilio, {Twilio as TwilioClient} from 'twilio';
import {
  RoomInstance,
  RoomListInstanceCreateOptions,
} from 'twilio/lib/rest/video/v1/room';
import {TwilioBindings} from './keys';
import {TwilioConfig} from './types';

import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import AccessToken, {VideoGrant} from 'twilio/lib/jwt/AccessToken';
import {RecordingInstance} from 'twilio/lib/rest/video/v1/recording';
import {
  TwilioMeetingResponse,
  TwilioS3TargetOptions,
  TwilioStatusCallbackEvents,
  TwilioWebhookPayload,
} from '.';
import {TwilioMeetingOptions, TwilioSessonOptions} from '..';
import {ArchiveResponse, SessionResponse, VideoChatFeatures} from '../..';
import {
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from '../../repositories';
export class TwilioService {
  twilioClient: TwilioClient;
  constructor(
    @inject(TwilioBindings.config) private readonly twilioConfig: TwilioConfig,
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @repository(SessionAttendeesRepository)
    private readonly sessionAttendeesRepository: SessionAttendeesRepository,
  ) {
    const {accountSid, apiSid, apiSecret, authToken} = twilioConfig;
    if (!(accountSid && apiSid && apiSecret && authToken)) {
      throw new HttpErrors.BadRequest(`Twilio API credentials are not set`);
    }
    this.twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  }

  async getToken(
    sessionId: string,
    options: TwilioSessonOptions,
  ): Promise<SessionResponse> {
    const twilioJWTToken = this.getAccessToken(sessionId);
    return {
      sessionId,
      token: twilioJWTToken,
    };
  }
  getAccessToken(sessionId: string): string {
    const token = new AccessToken(
      this.twilioConfig.accountSid,
      this.twilioConfig.apiSid,
      this.twilioConfig.authToken,
      {
        identity: sessionId,
      },
    );
    token.addGrant(new VideoGrant());
    return token.toJwt();
  }

  async getMeetingLink(
    meetingOptions: TwilioMeetingOptions,
  ): Promise<TwilioMeetingResponse> {
    const roomListInstanceCreateOptions: RoomListInstanceCreateOptions = {
      recordParticipantsOnConnect: meetingOptions.enableArchiving ?? false,
      unusedRoomTimeout: 10,
      statusCallback: meetingOptions.statusCallback ?? '',
      statusCallbackMethod: `POST`,
      type: meetingOptions.type ?? 'group',
    };
    if (
      roomListInstanceCreateOptions.recordParticipantsOnConnect &&
      roomListInstanceCreateOptions.type === 'peer-to-peer'
    ) {
      throw new HttpErrors.BadRequest(
        `recordParticipantsOnConnect feature is not available for ${roomListInstanceCreateOptions.type}`,
      );
    }

    const room = await this.createRoom(roomListInstanceCreateOptions, err => {
      if (err) {
        throw new HttpErrors.InternalServerError(
          `Error creating room ${err.message}`,
        );
      }
      return {};
    });

    return {
      meetingId: room.sid,
      isArchived: meetingOptions.enableArchiving ?? false,
      sessionId: room.sid ?? '',
    };
  }

  async getArchives(recordingSid: string | null): Promise<ArchiveResponse> {
    if (!recordingSid) {
      throw new HttpErrors.BadRequest(`recordingSid is required`);
    }

    const archive = await this.fetchArchive(recordingSid);
    const archiveResult: ArchiveResponse = {
      name: archive.trackName,
      sessionId: archive.groupingSids.roomSid,
      metaData: archive,
    };
    return archiveResult;
  }
  fetchArchive(recordingSid: string): Promise<Partial<RecordingInstance>> {
    return this.twilioClient.video.recordings(recordingSid).fetch();
  }
  async deleteArchive(archiveId: string): Promise<void> {
    await this.twilioClient.video.recordings(archiveId).remove((err, items) => {
      if (err) {
        throw new HttpErrors.ExpectationFailed(`Error deleting archive`);
      }
    });
  }

  async setUploadTarget(storageOptions: TwilioS3TargetOptions): Promise<void> {
    const awsCredentialsSid = this.twilioConfig.awsCredentialSid;
    if (!awsCredentialsSid) {
      throw new HttpErrors.InternalServerError(`Missing Aws credential Sid`);
    }
    const {awsS3Url, bucket} = storageOptions;
    if (awsS3Url) {
      await this.twilioClient.video.v1.recordingSettings().create({
        awsS3Url,
        awsStorageEnabled: true,
        awsCredentialsSid,
        friendlyName: bucket ?? 'External bucket for twilio recordings',
      });
    } else {
      throw new HttpErrors.BadRequest(
        `Missing parameters required for setting upload target to AWS S3`,
      );
    }
  }

  async checkWebhookPayload(
    webhookPayload: TwilioWebhookPayload,
  ): Promise<void> {
    try {
      const event = webhookPayload.statusCallbackEvent;
      const sessionDetail = await this.videoChatSessionRepository.findOne({
        where: {
          meetingLink: webhookPayload.roomSid ? webhookPayload.roomSid : '',
        },
      });
      //update archive Id
      if (event === TwilioStatusCallbackEvents.RecordingStarted) {
        await this.videoChatSessionRepository.updateById(sessionDetail?.id, {
          archiveId: webhookPayload.recordingSid,
        });
      } else if (event === TwilioStatusCallbackEvents.ParticipantConnected) {
        const sessionAttendessDetail =
          await this.sessionAttendeesRepository.findOne({
            where: {
              sessionId: webhookPayload.roomSid,
              attendee: webhookPayload.participantSid,
            },
          });

        if (!sessionAttendessDetail) {
          await this.sessionAttendeesRepository.create({
            sessionId: webhookPayload.roomSid,
            attendee: webhookPayload.participantSid,
            createdOn: new Date(),
            isDeleted: false,
            extMetadata: {webhookPayload},
          });
        } else {
          const updatedAttendee = {
            modifiedOn: new Date(),
            extMetadata: {webhookPayload},
          };

          await this.sessionAttendeesRepository.updateById(
            sessionAttendessDetail.id,
            updatedAttendee,
          );
        }
      } else if (event === TwilioStatusCallbackEvents.ParticipantDisconnected) {
        const sessionAttendessDetail =
          await this.sessionAttendeesRepository.findOne({
            where: {
              sessionId: webhookPayload.roomSid,
              attendee: webhookPayload.participantSid,
            },
          });
        const updatedAttendee = {
          modifiedOn: new Date(),
          isDeleted: true,
          extMetadata: {webhookPayload},
        };
        await this.sessionAttendeesRepository.updateById(
          sessionAttendessDetail?.id,
          updatedAttendee,
        );
      } else {
        // do nothing
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        `Error occured while handling webhook event ${error.message}`,
      );
    }
  }

  // sonarignore:start
  createRoom(
    createRoomConfig: RoomListInstanceCreateOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (error: Error | null, item?: RoomInstance) => any,
  ): Promise<RoomInstance> {
    // sonarignore:end
    if (!createRoomConfig) {
      return this.twilioClient.video.rooms.create(callback);
    } else {
      return this.twilioClient.video.rooms.create(createRoomConfig, callback);
    }
  }

  getFeatures(): VideoChatFeatures {
    return {
      archive: true,
      schedule: false,
    };
  }
}

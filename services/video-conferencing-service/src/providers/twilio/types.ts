// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  RoomListInstanceCreateOptions,
  RoomRoomStatus,
} from 'twilio/lib/rest/video/v1/room';
import {
  ArchiveResponse,
  ExternalStorageOptions,
  MeetingOptions,
  MeetingResponse,
  // S3TargetOptions,
  SessionOptions,
  SessionResponse,
  VideoChatFeatures,
  VideoChatInterface,
  WebhookPayloadParameters,
} from '../..';
import {RoomRoomType} from 'twilio/lib/rest/insights/v1/room';
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  apiSid: string;
  apiSecret: string;
  awsCredentialSid?: string;
}

export interface TwilioMeetingOptions
  extends MeetingOptions,
    RoomListInstanceCreateOptions {
  endToEndEncryption?: boolean;
  enableArchiving?: boolean;
  isScheduled: boolean;
  scheduleTime?: Date;
}
export interface TwilioVideoChat extends VideoChatInterface {
  getToken(
    sessionId: string,
    options: SessionOptions,
  ): Promise<SessionResponse>;
  getMeetingLink(options: MeetingOptions): Promise<MeetingResponse>;
  getArchives(archiveId: string): Promise<ArchiveResponse>;
  deleteArchive(archiveId: string): Promise<void>;
  setUploadTarget(storageOptions: ExternalStorageOptions): Promise<void>;
  getFeatures(): VideoChatFeatures;
}

// sonarignore:start
export interface TwilioMeetingResponse extends MeetingResponse {}
// sonarignore:end

export interface TwilioS3TargetOptions extends ExternalStorageOptions {
  awsS3Url: string;
  bucket?: string;
}
// sonarignore:start
export interface TwilioSessonOptions extends SessionOptions {}
// sonarignore:end

export interface TwilioWebhookPayload extends WebhookPayloadParameters {
  accountSid?: string;
  roomName?: string;
  roomSid?: string;
  roomStatus?: RoomRoomStatus;
  roomType?: RoomRoomType;
  statusCallbackEvent?: string;
  timestamp?: string;
  participantSid?: string;
  participantStatus?: string;
  participantDuration?: number;
  roomDuration?: number;
  sequenceNumber?: number;
  recordingSid?: string;
}

export enum TwilioStatusCallbackEvents {
  RoomCreated = 'room-created',
  RoomEnded = 'room-ended',
  ParticipantConnected = 'participant-connected',
  ParticipantDisconnected = 'participant-disconnected',
  RecordingStarted = 'recording-started',
  RecordingCompleted = 'recording-completed',
}

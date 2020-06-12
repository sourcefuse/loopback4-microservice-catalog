import {VonageEnums} from '../../enums/video-chat.enum';
import {
  ArchiveResponse,
  ArchiveResponseList,
  AzureTargetOptions,
  MeetingOptions,
  MeetingResponse,
  S3TargetOptions,
  SessionOptions,
  SessionResponse,
  VideoChatInterface,
} from '../../types';

export interface VonageConfig {
  apiKey: string;
  apiSecret: string;
  timeToStart: number;
}

/**
 * @interface VonageMeetingOptions
 * @param mediaMode optional parameter used in vonage (not in twilio) for checking mode routed/relayed
 * @param archiveMode optional parameter to enable/disable recordings. Default will be false
 * @param isScheduled parameter to check whether a meeting is booked now if @param isScheduled=false  or scheduled at a later time if @param isScheduled=true.
 * @param scheduleTime not required if @param isScheduled is false, else set a later time for scheduling meeting
 *
 */
export interface VonageMeetingOptions extends MeetingOptions {
  endToEndEncryption?: boolean;
  enableArchiving?: boolean;
  isScheduled: boolean;
  scheduleTime?: Date;
}

export interface VonageMeetingResponse extends MeetingResponse {
  mediaMode: VonageEnums.MediaMode;
  archiveMode: VonageEnums.ArchiveMode;
}

/**
 * @interface VonageSessionOptions
 * @param meetingId unique meetingId which is used inside sharing link urls.
 * @param role optional enum used in vonage (publisher, subscriber, moderator)
 * @param expireTime set the ttl (time to live) for a session created For twilio, it is max 4 hours.
 * @param data optional string parameter if required for successfully creating session
 */
export interface VonageSessionOptions extends SessionOptions {
  meetingId: string;
  role?: VonageEnums.Role;
  expireTime?: Date;
  data?: string;
}
/**
 * @interface VonageS3TargetOptions
 * @param config object containing azure/s3 details
 * @param accessKey access key id of aws iam account
 * @param secretKey secret access key of aws iam account
 * @param bucket s3 bucket name
 * @param fallback: optional parameter used for vonage to set fallback if upload fails. if it is none, it will not be available.
 * setting fallback to "opentok" will make the archive available  at the vonage dashboard
 */
export interface VonageS3TargetOptions extends S3TargetOptions {
  accessKey: string;
  secretKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
  fallback: VonageEnums.FallbackType;
}

/**
 * @interface VonageAzureTargetOptions
 * @param accountName The Windows Azure account name
 * @param accountKey The Windows Azure account key
 * @param container The Windows Azure container name
 * @param domain (optional) — The Windows Azure domain in which the container resides.
 * @param fallback optional parameter used for vonage to set fallback if upload fails. if it is none, it will not be available.
 * setting fallback to "opentok" will make the archive available  at the vonage dashboard
 */
export interface VonageAzureTargetOptions extends AzureTargetOptions {
  accountName: string;
  accountKey: string;
  container: string;
  domain?: string;
  fallback: VonageEnums.FallbackType;
}


export interface VonageVideoChat extends VideoChatInterface {
  /**
   * @function getMeetingLink Generates a meeting Id which is further used for sharing links
   * @param options: object with type @interface MeetingOptions which is defined as an Interface
   * @returns Promise when resolved returns meeting id
   */
  getMeetingLink(options: MeetingOptions): Promise<VonageMeetingResponse>;
  /**
   * @function getToken Generates a token which is used for authorization to connect to a room
   * @param options: object with type @interface SessionOptions
   * @returns Promise when resolved returns object of type @interface SessionResponse
   */
  getToken(sessionId: string, options: SessionOptions): Promise<SessionResponse>;
  /**
   * @function startArchive store vonage/twilio/agora archives in cloud/s3/azure
   *
   * @param archiveOptions: object with type @interface VonageArchive
   * @returns Promise if resolved, returns archiveId and success message
   */
  // startArchive(archiveOptions: VonageArchive): Promise<VonageArchiveResponse>;

  /**
   * @function getArchives get a specific recorded/composed archive or a list of archives
   * @param archiveId: optional archive id of type number
   * @returns a list of archives after resolving promise
   */
  getArchives(
    archiveId: string | null,
  ): Promise<ArchiveResponse | ArchiveResponseList>;
  /**
   * @function deleteArchive delete a specific archive
   * @param archiveId id of an archive
   * @returns Promise then returns a successful message for deleting if promise is resolved
   */
  deleteArchive(archiveId: string): Promise<void>;
  /**
   * @function stopArchive stop recording the archive
   * @param archiveId archive id of an archive which was started
   * @returns Promise when returns a success object of type @interface VonageArchiveResponse
   */
  // stopArchive(archiveId: string): Promise<VonageArchiveResponse>;
}

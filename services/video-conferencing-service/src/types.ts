import {IServiceConfig} from '@sourceloop/core';

export interface IVideoChatServiceConfig extends IServiceConfig {
  // TODO
  // will be filled later
}

/**
 * @interface ResponseInterface
 * @param message describes sucess/failure or any descriptive message w.r.t any API/function executed
 */
export interface ResponseInterface {
  message: string;
}

export interface VideoChatInterface {
  /**
   * @function getMeetingLink Generates a meeting Id which is further used for sharing links
   * @param options: object with type @interface MeetingOptions which is defined as an Interface
   * @returns Promise when resolved returns object of @interface MeetingResponse
   */
  getMeetingLink(options: MeetingOptions): Promise<MeetingResponse>;
  /**
   * @function getToken Generates a token which is used for authorization to connect to a room
   * @param options: object with type @interface SessionOptions
   * @returns Promise when resolved returns object of type @interface SessionResponse
   */
  getToken(sessionId: string, options: SessionOptions): Promise<SessionResponse>;
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
}

/**
 * @interface SessionResponse
 * @param sessionId unique room name which is sent as a response to connect to a room.
 * @param token token generated for authorization
 */
export interface SessionResponse {
  sessionId: string;
  token: string;
}

/**
 * @interface ArchiveResponse
 * @param name Optional name of an archive
 * @param sessionId Session Id of the meeting that has been used for archiving
 */
export interface ArchiveResponse {
  name?: string;
  sessionId: string;
  metaData: object;
}

/**
 * @interface ArchiveResponseList
 * @param count Number of archives
 * @param items array containing list of @interface ArchiveResponse
 */
export interface ArchiveResponseList {
  count: number;
  items: ArchiveResponse[];
}

/**
 * @interface S3TargetOptions
 * @param config object containing azure/s3 details
 * @param accessKey access key id of aws iam account
 * @param secretKey secret access key of aws iam account
 * @param bucket s3 bucket name
 */
export interface S3TargetOptions {
  accessKey: string;
  secretKey: string;
  region: string;
  bucket: string;
}

/**
 * @interface AzureTargetOptions
 * @param accountName The Windows Azure account name
 * @param accountKey The Windows Azure account key
 * @param container The Windows Azure container name
 * @param domain (optional) — The Windows Azure domain in which the container resides.
 */
export interface AzureTargetOptions {
  accountName: string;
  accountKey: string;
  container: string;
  domain?: string;
}

/**
 * @interface MeetingOptions
 * @param archiveMode optional parameter to enable/disable recordings. Default will be false
 * @param isScheduled parameter to check whether a meeting is booked now if @param isScheduled=false  or scheduled at a later time if @param isScheduled=true.
 * @param scheduleTime not required if @param isScheduled is false, else set a later time for scheduling meeting
 *
 */
export interface MeetingOptions {
  isScheduled: boolean;
  scheduleTime?: Date;
}

export interface MeetingResponse {
  sessionId: string;
}

/**
 * @interface SessionOptions
 * @param meetingId unique meetingId which is used inside sharing link urls.
 * @param expireTime set the ttl (time to live) for a session created For twilio, it is max 4 hours.
 */
export interface SessionOptions {
  meetingLink: string;
  expireTime?: Date;
  data?: string;
}

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
  mediaMode?: VonageEnums.MediaMode;
  archiveMode?: VonageEnums.ArchiveMode;
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
  expireTime: Date;
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

/**
 * @interface VonageArchive
 * @param sessionId (String) — (Required) The session ID of the OpenTok session you want to start archiving
 * @param hasAudio (Boolean) — (Optional) Whether the archive will record audio (true, the default) or not (false).
 * If you set both @param hasAudio and @param hasVideo to false, it will result in an error.
 * @param layout (Object) — Optional. Specify this to assign the initial layout type for the archive. This applies only to composed archives.
 *   @param type default is bestFit. Valid values for the layout property are "bestFit" (best fit),
 *             "custom" (custom), "horizontalPresentation" (horizontal presentation),
 *             "pip" (picture-in-picture), and "verticalPresentation" (vertical presentation))
 *   @param stylesheet if you specify a "custom" @param type, set the stylesheet property of the layout object to the stylesheet.
 * @param name (String) — (Optional) The name of the archive (for your own identification)
 * @param outputMode String) — (Optional) Whether all streams in the archive are recorded to a single file
 * ("composed", the default) or to individual files ("individual")
 * @param resolution  (String) — (Optional) The resolution of the archive, either "640x480" (SD, the default)
 * or "1280x720" (HD). This property only applies to composed archives. If you set this property and set the
 * outputMode property to "individual", the call to the REST method results in an error.
 */
export interface VonageArchive {
  sessionId: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
  layout?: {
    type: VonageEnums.ArchiveLayout;
    stylesheet?: string;
  };
  name?: string;
  outputMode?: VonageEnums.OutputMode;
  resolution?: string;
}

/**
 * @interface VonageArchiveResponse
 * @param createdAt The timestamp for when the archive started recording, expressed in milliseconds since the Unix epoch (January 1, 1970, 00:00:00 UTC).
 * @param hasAudio Whether the archive will record audio (true) or not (false)
 * @param hasVideo Whether the archive will record video (true) or not (false)
 * @param id The unique archive ID. Store this value for later use (for example, to stop the recording).
 * @param outputMode Either "composed" or "individual".
 * @param projectId Your OpenTok API key.
 * @param resolution The resolution of the archive (either "640x480" or "1280x720").
 * This property is only set for composed archives.
 * @param sessionId The session ID of the OpenTok session being archived.
 * @param name The name of the archive you supplied (this is optional)
 */

export interface VonageArchiveResponse extends ArchiveResponse {
  createdAt: number;
  duration: number;
  hasAudio: boolean;
  hasVideo: boolean;
  id: string;
  name?: string;
  outputMode: VonageEnums.OutputMode;
  projectId: number;
  reason: string;
  resolution: string;
  sessionId: string;
  size: number;
  status: string;
  url: string | null;
}

/**
 * @interface VonageArchiveList
 * @param count number of archives
 * @param items listing archives of type @interface VonageArchiveResponse
 */
export interface VonageArchiveList extends ArchiveResponseList {
  count: number;
  items: VonageArchiveResponse[];
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
  getToken(options: SessionOptions): Promise<SessionResponse>;
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
  ): Promise<VonageArchiveResponse | VonageArchiveList>;
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

  /**
   * @function stopMeeting stops the meeting
   * @param meetingId unique meeting id
   */
  stopMeeting(meetingId: string): Promise<void>;
}

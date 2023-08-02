declare namespace OT {
  type MediaProcessorConnector = {
    setTrack: (track: MediaStreamTrack) => Promise<MediaStreamTrack>;
    destroy: () => Promise<void>;
  };

  export type OTError = {
    name: string;
    message: string;
  };

  export type Dimensions = {
    width: number;
    height: number;
  };

  export type ScreenSharingCapabilityResponse = {
    extensionInstalled?: boolean;
    supported: boolean;
    supportedSources: {
      application?: boolean;
      screen?: boolean;
      window?: boolean;
    };
    extensionRequired?: string;
    extensionRegistered?: boolean;
  };

  export function checkScreenSharingCapability(
    callback: (response: ScreenSharingCapabilityResponse) => void
  ): void;

  export function checkSystemRequirements(): number;

  export type Device = {
    kind: "audioInput" | "videoInput";
    deviceId: string;
    label: string;
  };

  export type AudioOutputDevice = {
    deviceId: string | null | undefined;
    label: string | null;
  };

  export type IceConfig = {
    includeServers: "all" | "custom";
    transportPolicy: "all" | "relay";
    customServers: Array<{
      urls: string | string[];
      username?: string;
      credential?: string;
    }>;
  };

  export function getDevices(
    callback: (error: OTError | undefined, devices?: Device[]) => void
  ): void;

  export function getAudioOutputDevices(): Promise<AudioOutputDevice[]>;

  export function setProxyUrl(proxyUrl: string): void;

  export function getSupportedCodecs(): Promise<{
    videoEncoders: ("H264" | "VP8")[];
    videoDecoders: ("H264" | "VP8")[];
  }>;

  export function hasMediaProcessorSupport(): boolean;

  export function hasEndToEndEncryptionSupport(): boolean;

  export type WidgetStyle = {
    audioLevelDisplayMode: "auto" | "on" | "off";
    backgroundImageURI: string;
    buttonDisplayMode: "auto" | "on" | "off";
    nameDisplayMode: "auto" | "on" | "off";
  };

  export type WidgetProperties = {
    fitMode?: "cover" | "contain";
    insertDefaultUI?: boolean;
    insertMode?: "replace" | "after" | "before" | "append";
    showControls?: boolean;
    width?: string | number;
    height?: string | number;
  };

  export type PublisherStyle = WidgetStyle & {
    archiveStatusDisplayMode: "auto" | "off";
  };

  export type GetUserMediaProperties = {
    audioSource?: string | null | boolean | MediaStreamTrack;
    disableAudioProcessing?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
    facingMode?: "user" | "environment" | "left" | "right";
    frameRate?: 30 | 15 | 7 | 1;
    maxResolution?: Dimensions;
    resolution?:
      | "1920x1080"
      | "1280x960"
      | "1280x720"
      | "640x480"
      | "640x360"
      | "320x240"
      | "320x180";
    videoSource?: string | null | boolean | MediaStreamTrack;
  };

  export type VideoContentHint = "text" | "detail" | "motion" | "";

  export type BackgroundBlurFilter = {
    type: "backgroundBlur";
    blurStrength?: "low" | "high";
  };

  export type BackgroundReplacementFilter = {
    type: "backgroundReplacement";
    backgroundImgUrl: string;
  };

  export type VideoFilter = BackgroundBlurFilter | BackgroundReplacementFilter;

  export type PublisherProperties = WidgetProperties &
    GetUserMediaProperties & {
      audioBitrate?: number;
      audioFallbackEnabled?: boolean;
      initials?: string;
      mirror?: boolean;
      name?: string;
      publishAudio?: boolean;
      publishVideo?: boolean;
      publishCaptions?: boolean;
      scalableScreenshare?: boolean;
      scalableVideo?: boolean;
      style?: Partial<PublisherStyle>;
      videoContentHint?: VideoContentHint;
      enableDtx?: boolean;
      enableStereo?: boolean;
      videoFilter?: VideoFilter;
    };

  export type SubscriberStyle = WidgetStyle & {
    videoDisabledDisplayMode: "auto" | "on" | "off";
    audioBlockedDisplayMode: "auto" | "on" | "off";
  };

  export type SubscriberProperties = WidgetProperties & {
    audioVolume?: number;
    preferredFrameRate?: number;
    preferredResolution?: Dimensions;
    style?: Partial<SubscriberStyle>;
    subscribeToAudio?: boolean;
    subscribeToVideo?: boolean;
    testNetwork?: boolean;
  };

  export class Connection {
    connectionId: string;
    creationTime: number;
    data: string;
  }

  export class Stream {
    connection: Connection;
    creationTime: number;
    frameRate: number;
    hasAudio: boolean;
    hasVideo: boolean;
    initials: string;
    name: string;
    streamId: string;
    videoDimensions: {
      width: number;
      height: number;
    };
    videoType: "camera" | "screen" | "custom" | undefined;
  }

  export type Event<Type, Target> = {
    type: Type;
    cancelable: boolean;
    target: Target;

    isDefaultPrevented(): boolean;
    preventDefault(): void;
  };

  export type ExceptionEvent = Event<"exception", {}> & {
    code: number;
    message: string;
    title: string;
  };

  export type VideoDimensionsChangedEvent<Target> = Event<
    "videoDimensionsChanged",
    Target
  > & {
    oldValue: Dimensions;
    newValue: Dimensions;
  };

  class OTEventEmitter<EventMap> {
    on<EventName extends keyof EventMap>(
      eventName: EventName,
      callback: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    on(
      eventName: string,
      callback: (event: Event<string, any>) => void,
      context?: object
    ): void;

    on(eventMap: object, context?: object): void;

    once<EventName extends keyof EventMap>(
      eventName: EventName,
      callback: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    once(
      eventName: string,
      callback: (event: Event<string, any>) => void,
      context?: object
    ): void;

    once(eventMap: object, context?: object): void;

    off<EventName extends keyof EventMap>(
      eventName?: EventName,
      callback?: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    off(
      eventName?: string,
      callback?: (event: Event<string, any>) => void,
      context?: object
    ): void;

    off(eventMap: object, context?: object): void;
  }

  export class Publisher extends OTEventEmitter<{
    accessAllowed: Event<"accessAllowed", Publisher>;
    accessDenied: Event<"accessDenied", Publisher>;
    accessDialogClosed: Event<"accessDialogClosed", Publisher>;
    accessDialogOpened: Event<"accessDialogOpened", Publisher>;

    audioLevelUpdated: Event<"audioLevelUpdated", Publisher> & {
      audioLevel: number;
    };

    destroyed: Event<"destroyed", Publisher>;

    mediaStopped: Event<"mediaStopped", Publisher> & {
      track: MediaStreamTrack | undefined;
    };

    streamCreated: Event<"streamCreated", Publisher> & {
      stream: Stream;
    };

    streamDestroyed: Event<"streamDestroyed", Publisher> & {
      stream: Stream;
      reason: string;
    };

    videoDimensionsChanged: VideoDimensionsChangedEvent<Publisher>;

    videoElementCreated: Event<"videoElementCreated", Publisher> & {
      element: HTMLVideoElement | HTMLObjectElement;
    };

    muteForced: Event<"muteForced", Publisher>;
  }> {
    accessAllowed: boolean;
    element?: HTMLElement | undefined;
    id?: string;
    stream?: Stream;
    session?: Session;
    token: string;

    destroy(): void;
    getImgData(): string | null;
    getStats(
      callback: (error?: OTError, stats?: PublisherStatsArr) => void
    ): void;
    getRtcStatsReport(): Promise<PublisherRtcStatsReportArr>;
    getStyle(): PublisherStyle;
    applyVideoFilter(videoFilter: VideoFilter): Promise<void>;
    getVideoFilter(): VideoFilter | null;
    clearVideoFilter(): Promise<void>;
    publishAudio(value: boolean): void;
    publishVideo(value: boolean): void;
    publishCaptions(value: boolean): void;
    cycleVideo(): Promise<{ deviceId: string }>;
    setAudioSource(audioSource: string | MediaStreamTrack): Promise<undefined>;
    getAudioSource(): MediaStreamTrack;
    setVideoSource(videoSourceId: string): Promise<undefined>;
    getVideoContentHint(): VideoContentHint;
    setVideoContentHint(hint: VideoContentHint): void;
    getVideoSource(): {
      deviceId: string | null;
      type: string | null;
      track: MediaStreamTrack | null;
    };
    setStyle<Style extends keyof PublisherStyle>(
      style: Style,
      value: PublisherStyle[Style]
    ): void;
    videoWidth(): number | undefined;
    videoHeight(): number | undefined;
    setVideoMediaProcessorConnector(
      connector: MediaProcessorConnector | null
    ): Promise<void>;
    setAudioMediaProcessorConnector(
      connector: MediaProcessorConnector | null
    ): Promise<void>;
  }

  export function getUserMedia(
    properties?: GetUserMediaProperties
  ): Promise<MediaStream>;

  export function initPublisher(
    targetElement?: HTMLElement | string,
    properties?: PublisherProperties,
    callback?: (error?: OTError) => void
  ): Publisher;

  export function log(message: string): void;

  export function off(
    eventName?: "exception",
    callback?: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export function on(
    eventName: "exception",
    callback: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export function once(
    eventName: "exception",
    callback: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export class Session extends OTEventEmitter<{
    archiveStarted: Event<"archiveStarted", Session> & {
      id: string;
      name: string;
    };

    archiveStopped: Event<"archiveStopped", Session> & {
      id: string;
      name: string;
    };

    connectionCreated: Event<"connectionCreated", Session> & {
      connection: Connection;
    };

    connectionDestroyed: Event<"connectionDestroyed", Session> & {
      connection: Connection;
      reason: string;
    };

    sessionConnected: Event<"sessionConnected", Session>;

    sessionDisconnected: Event<"sessionDisconnected", Session> & {
      reason: string;
    };

    sessionReconnected: Event<"sessionReconnected", Session>;
    sessionReconnecting: Event<"sessionReconnecting", Session>;

    signal: Event<"signal", Session> & {
      type?: string;
      data?: string;
      from: Connection | null;
    };

    streamCreated: Event<"streamCreated", Session> & {
      stream: Stream;
    };

    streamDestroyed: Event<"streamDestroyed", Session> & {
      stream: Stream;
      reason: string;
    };

    streamPropertyChanged: Event<"streamPropertyChanged", Session> & {
      stream: Stream;
    } & (
        | { changedProperty: "hasAudio"; oldValue: boolean; newValue: boolean }
        | { changedProperty: "hasVideo"; oldValue: boolean; newValue: boolean }
        | {
            changedProperty: "videoDimensions";
            oldValue: Dimensions;
            newValue: Dimensions;
          }
      );

    muteForced: Event<"muteForced", Session>;
  }> {
    capabilities: {
      forceDisconnect: number;
      forceUnpublish: number;
      forceMute: number;
      publish: number;
      subscribe: number;
    };

    connection?: Connection;
    sessionId: string;

    connect(token: string, callback: (error?: OTError) => void): void;
    disconnect(): void;
    forceDisconnect(
      connection: Connection,
      callback: (error?: OTError) => void
    ): void;
    forceUnpublish(stream: Stream, callback: (error?: OTError) => void): void;
    forceMuteStream(stream: Stream): Promise<void>;
    forceMuteAll(excludedStreams?: Stream[]): Promise<void>;
    getPublisherForStream(stream: Stream): Publisher | undefined;
    getSubscribersForStream(stream: Stream): [Subscriber];
    publish(
      publisher: Publisher,
      callback?: (error?: OTError) => void
    ): Publisher;
    publish(
      targetElement: string | HTMLElement,
      properties?: PublisherProperties,
      callback?: (error?: OTError) => void
    ): Publisher;
    setEncryptionSecret(secret: string): Promise<void>;
    setIceConfig(iceConfig: IceConfig): Promise<void>;

    signal(
      signal: { type?: string; data?: string; to?: Connection },
      callback: (error?: OTError) => void
    ): void;

    subscribe(
      stream: Stream,
      targetElement?: HTMLElement | string,
      properties?: SubscriberProperties,
      callback?: (error?: OTError) => void
    ): Subscriber;

    unpublish(publisher: Publisher): void;
    unsubscribe(subscriber: Subscriber): void;
  }

  export function initSession(
    partnerId: string,
    sessionId: string,
    options?: {
      connectionEventsSuppressed?: boolean;
      iceConfig?: IceConfig;
      ipWhitelist?: boolean;
      encryptionSecret?: string;
    }
  ): Session;

  export type IncomingTrackStats = {
    bytesReceived: number;
    packetsLost: number;
    packetsReceived: number;
  };

  export type OutgoingTrackStats = {
    bytesSent: number;
    packetsLost: number;
    packetsSent: number;
  };

  export type SubscriberStats = {
    audio: IncomingTrackStats;
    video: IncomingTrackStats & { frameRate: number };
    timestamp: number;
  };

  export type PublisherStats = {
    audio: OutgoingTrackStats;
    video: OutgoingTrackStats & { frameRate: number };
    timestamp: number;
  };

  export type PublisherStatContainer = {
    subscriberId?: string;
    connectionId?: string;
    stats: PublisherStats;
  };

  export type PublisherStatsArr = PublisherStatContainer[];

  export type PublisherRtcStatsReportContainer = {
    subscriberId?: string;
    connectionId?: string;
    rtcStatsReport: RTCStatsReport;
  };

  export type PublisherRtcStatsReportArr = PublisherRtcStatsReportContainer[];

  export class Subscriber extends OTEventEmitter<{
    audioLevelUpdated: Event<"audioLevelUpdated", Subscriber> & {
      audioLevel: number;
    };

    connected: Event<"connected", Subscriber>;

    captionReceived: Event<"captionReceived", Subscriber> & {
      streamId: string;
      caption: string;
      isFinal: boolean;
    };

    destroyed: Event<"destroyed", Subscriber> & {
      reason: string;
    };

    encryptionSecretMismatch: Event<"encryptionSecretMismatch", Subscriber>;

    encryptionSecretMatch: Event<"encryptionSecretMatch", Subscriber>;

    videoDimensionsChanged: VideoDimensionsChangedEvent<Subscriber>;

    videoDisabled: Event<"videoDisabled", Subscriber> & {
      reason: string;
    };

    videoDisableWarning: Event<"videoDisableWarning", Subscriber>;
    videoDisableWarningLifted: Event<"videoDisableWarningLifted", Subscriber>;

    videoElementCreated: Event<"videoElementCreated", Subscriber> & {
      element: HTMLVideoElement | HTMLObjectElement;
    };

    videoEnabled: Event<"videoEnabled", Subscriber> & {
      reason: string;
    };
  }> {
    element?: HTMLElement;
    id?: string;
    stream?: Stream;
    session: Session;
    token: string;

    getAudioVolume(): number;
    getImgData(): string | null;
    getStats(
      callback: (error?: OTError, stats?: SubscriberStats) => void
    ): void;
    getRtcStatsReport(): Promise<RTCStatsReport>;
    subscribeToCaptions(value: boolean): Promise<void>;
    isSubscribedToCaptions(): boolean;
    isAudioBlocked(): boolean;
    restrictFrameRate(value: boolean): void;
    setAudioVolume(volume: number): void;
    setPreferredFrameRate(frameRate: number): void;
    setPreferredResolution(resolution: Dimensions): void;
    subscribeToAudio(value: boolean): void;
    subscribeToVideo(value: boolean): void;

    setStyle<Style extends keyof SubscriberStyle>(
      style: Style,
      value: SubscriberStyle[Style]
    ): void;

    videoHeight(): number | undefined;
    videoWidth(): number | undefined;
  }

  export function registerScreenSharingExtension(
    kind: string,
    id: string,
    version: number
  ): void;

  export function reportIssue(
    callback: (error?: OTError, reportId?: string) => void
  ): void;

  export function setAudioOutputDevice(deviceId: string): Promise<void>;

  export function getActiveAudioOutputDevice(): Promise<AudioOutputDevice>;

  export function setLogLevel(level: number): void;

  export function upgradeSystemRequirements(): void;

  export function unblockAudio(): Promise<undefined>;
}

declare module "@opentok/client" {
  export = OT;
}

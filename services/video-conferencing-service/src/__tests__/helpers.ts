import {
  SessionOptions,
  MeetingOptions,
  SessionResponse,
  VideoChatInterface,
  ArchiveResponse,
  ArchiveResponseList,
  MeetingResponse,
} from '../types';
import {VideoChatSession} from '../models';
import {VonageMeetingOptions, VonageSessionOptions} from '../providers/vonage';
import {VonageEnums} from '../enums/video-chat.enum';
import moment from 'moment';
import {sinon} from '@loopback/testlab';

export function getVideoChatSession(
  videoChatSession: Partial<VideoChatSession>,
) {
  const data = Object.assign(
    {
      sessionId: 'dummy-session-id',
      meetingLink: 'dummy-meeting-link',
      isScheduled: false,
    },
    videoChatSession,
  );

  return new VideoChatSession(data);
}

export function getDate(dateString: string) {
  return new Date(dateString);
}

export function getFutureDate() {
  const extra = 1000;
  const currDate = Date.now();
  return moment(currDate)
    .add(extra, 'm')
    .toDate();
}

export function getDatePastThreshold(threshold: number) {
  const extra = 5;
  const currDate = Date.now();
  return moment(currDate)
    .add(threshold + extra, 'm')
    .toDate();
}

export function setUpMockProvider(providerStub: Partial<VideoChatInterface>) {
  return Object.assign(
    {
      getMeetingLink: sinon.stub().returnsThis(),
      getToken: sinon.stub().returnsThis(),
      getArchives: sinon.stub().returnsThis(),
      deleteArchive: sinon.stub().returnsThis(),
    },
    providerStub,
  );
}

export function getMeetingOptions(meetingOptions: Partial<MeetingOptions>) {
  return Object.assign(
    {
      enableArchiving: true,
      isScheduled: false,
    },
    meetingOptions,
  );
}

export function getSessionOptions(sessionOptions: Partial<SessionOptions>) {
  return Object.assign(
    {
      meetingLink: 'dummy-meeting-link',
      expireTime: getFutureDate(),
    },
    sessionOptions,
  );
}

export function getMeetingResponse(meetingResponse: Partial<MeetingResponse>) {
  return Object.assign(
    {
      mediaMode: VonageEnums.MediaMode.Routed,
      archiveMode: VonageEnums.ArchiveMode.Always,
      sessionId: 'session-id',
    },
    meetingResponse,
  );
}

export function getSessionResponse(sessionResponse: Partial<SessionResponse>) {
  return Object.assign(
    {
      sessionId: 'session-id',
      token: 'token',
    },
    sessionResponse,
  );
}

export function getArchiveResponse(archiveResponse: Partial<ArchiveResponse>) {
  return Object.assign(
    {
      sessionId: 'dummy-session-id',
    },
    archiveResponse,
  );
}

export function getArchiveResponseList(
  archiveResponseList: Partial<ArchiveResponseList>,
) {
  const dummyCount = 1;
  return Object.assign(
    {
      count: dummyCount,
      items: [getArchiveResponse],
    },
    archiveResponseList,
  );
}

export function getVonageMeetingOptions(
  vonageMeetingOptions: Partial<VonageMeetingOptions>,
) {
  return Object.assign(
    {
      isScheduled: false,
    },
    vonageMeetingOptions,
  );
}

export function getVonageSessionOptions(
  vonageSessionOptions: Partial<VonageSessionOptions>,
) {
  return Object.assign(
    {
      meetingLink: 'dummy-meeting-link',
      meetingId: 'dummy-meeting-id',
      expireTime: getFutureDate(),
      role: VonageEnums.Role.Subscriber,
    },
    vonageSessionOptions,
  );
}

export function getVonageArchive() {
  return {
    createdAt: 1234,
    duration: '1',
    id: '1',
    name: 'archive-1',
    partnerId: 'partner-id',
    reason: 'reason',
    sessionId: 'session-id',
    size: 1234,
    status: 'available',
    hasAudio: true,
    hasVideo: true,
    outputMode: 'composed',
    url: 'url',
  };
}

export function getVonageArchiveList() {
  return [getVonageArchive(),
    {
      createdAt: 4321,
      duration: '2',
      id: '2',
      name: 'archive-2',
      partnerId: 'partner-id',
      reason: 'reason',
      sessionId: 'session-id',
      size: 4321,
      status: 'available',
      hasAudio: true,
      hasVideo: true,
      outputMode: 'composed',
      url: 'url',
    },
  ];
}
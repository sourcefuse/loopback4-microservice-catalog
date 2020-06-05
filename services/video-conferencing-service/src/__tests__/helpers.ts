import {SessionOptions, MeetingOptions, SessionResponse, VideoChatInterface, ArchiveResponse, ArchiveResponseList} from '../types';
import {VideoChatSession} from '../models';
import {VonageMeetingResponse} from '../providers/vonage';
import {VonageEnums} from '../enums/video-chat.enum';
import moment from 'moment';
import {
  sinon,
} from '@loopback/testlab';

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
      expireTime: getFutureDate(),
    },
    sessionOptions,
  );
}

export function getVonageMeetingResponse(
  meetingResponse: Partial<VonageMeetingResponse>,
) {
  return Object.assign(
    {
      mediaMode: VonageEnums.MediaMode.Routed,
      archiveMode: VonageEnums.ArchiveMode.Always,
      sessionId: 'session-id',
    },
    meetingResponse,
  );
}

export function getVonageSessionResponse(
  sessionResponse: Partial<SessionResponse>,
) {
  return Object.assign(
    {
      sessionId: 'session-id',
      token: 'token',
    },
    sessionResponse 
  );
}

export function getVonageArchiveResponse(
  archiveResponse: Partial<ArchiveResponse>
) {
  return Object.assign(
    {
      sessionId: 'dummy-session-id',
    },
    archiveResponse
  );
}

export function getVonageArchiveResponseList(
  archiveResponseList: Partial<ArchiveResponseList>
) {
  const dummyCount = 1;
  return Object.assign(
    {
      count: dummyCount,
      items: [getVonageArchiveResponse]
    },
    archiveResponseList
  );
}

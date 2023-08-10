// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {sinon} from '@loopback/testlab';
import moment from 'moment';
import {RecordingInstance} from 'twilio/lib/rest/video/v1/recording';
import {RoomInstance} from 'twilio/lib/rest/video/v1/room';
import {TwilioMeetingOptions} from '..';
import {VonageEnums} from '../enums/video-chat.enum';
import {SessionAttendees, VideoChatSession} from '../models';
import {
  VonageMeetingOptions,
  VonageSessionOptions,
  VonageSessionWebhookPayload,
} from '../providers/vonage';
import {
  ArchiveResponse,
  ArchiveResponseList,
  MeetingOptions,
  MeetingResponse,
  SessionOptions,
  SessionResponse,
  VideoChatInterface,
} from '../types';

const meetingLink = 'dummy-meeting-link-id';
const sessionId = 'dummy-session-id';

export function getVideoChatSession(
  videoChatSession: Partial<VideoChatSession>,
) {
  const data = {
    sessionId: sessionId,
    meetingLink: meetingLink,
    isScheduled: false,
    ...videoChatSession,
  };
  return new VideoChatSession(data);
}

export function getDate(dateString: string) {
  return new Date(dateString);
}

export function getFutureDate() {
  const extra = 1000;
  const currDate = Date.now();
  return moment(currDate).add(extra, 'm').toDate();
}

export function getDatePastThreshold(threshold: number) {
  const extra = 5;
  const currDate = Date.now();
  return moment(currDate)
    .add(threshold + extra, 'm')
    .toDate();
}

export function setUpMockProvider(providerStub: Partial<VideoChatInterface>) {
  const stubbedProvider = {
    getMeetingLink: sinon.stub().returnsThis(),
    getToken: sinon.stub().returnsThis(),
    getArchives: sinon.stub().returnsThis(),
    deleteArchive: sinon.stub().returnsThis(),
    setUploadTarget: sinon.stub().returnsThis(),
    getFeatures: sinon.stub().returns(getVideoChatFeatures()),
    checkWebhookPayload: sinon.stub().returnsThis(),
  };
  return Object.assign(stubbedProvider, providerStub);
}

export function getVideoChatFeatures() {
  return {
    archive: true,
    schedule: true,
  };
}
export function getMeetingOptions(meetingOptions: Partial<MeetingOptions>) {
  return {
    enableArchiving: true,
    isScheduled: false,
    ...meetingOptions,
  };
}

export function getSessionOptions(sessionOptions: Partial<SessionOptions>) {
  return {
    meetingLink: meetingLink,
    expireTime: getFutureDate(),
    ...sessionOptions,
  };
}

export function getVonageMeetingResponse(
  meetingResponse: Partial<MeetingResponse>,
) {
  return {
    mediaMode: VonageEnums.MediaMode.Routed,
    archiveMode: VonageEnums.ArchiveMode.Always,
    sessionId: sessionId,
    ...meetingResponse,
  };
}

export function getSessionResponse(sessionResponse: Partial<SessionResponse>) {
  return {
    sessionId: sessionId,
    token: 'token',
    ...sessionResponse,
  };
}

export function getArchiveResponse(archiveResponse: Partial<ArchiveResponse>) {
  return {
    sessionId: sessionId,
    ...archiveResponse,
  };
}

export function getArchiveResponseList(
  archiveResponseList: Partial<ArchiveResponseList>,
) {
  const dummyCount = 1;
  return {
    count: dummyCount,
    items: [getArchiveResponse],
    ...archiveResponseList,
  };
}

export function getVonageMeetingOptions(
  vonageMeetingOptions: Partial<VonageMeetingOptions>,
) {
  return {
    isScheduled: false,
    ...vonageMeetingOptions,
  };
}

export function getVonageSessionOptions(
  vonageSessionOptions: Partial<VonageSessionOptions>,
) {
  return {
    meetingLink: meetingLink,
    meetingId: 'dummy-meeting-id',
    expireTime: getFutureDate(),
    role: VonageEnums.Role.Subscriber,
    sessionId: 'dummy-session-id',
    ...vonageSessionOptions,
  };
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
  return [
    getVonageArchive(),
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

export function getWebhookPayload(
  vonageSessionWebhookPayload: Partial<VonageSessionWebhookPayload>,
) {
  return {
    sessionId: sessionId,
    projectId: '123456',
    event: 'connectionCreated',
    timestamp: 1470257688309,
    connection: {
      id: 'c053fcc8-c681-41d5-8ec2-7a9e1434a21e',
      createdAt: 1470257688143,
      data: 'TOKENDATA',
    },
    ...vonageSessionWebhookPayload,
  } as VonageSessionWebhookPayload;
}

export const stream = {
  id: 'd053fcc8-c681-41d5-8ec2-7a9e1434a21f',
  createdAt: 1591599253840,
  connection: {
    id: 'd053fcc8-c681-41d5-8ec2-7a9e1434a21f',
    createdAt: 2470257688144,
    data: 'TOKENDATA',
  },
  videoType: 'camera',
};

export function getSessionAttendeesModel() {
  const data = {
    sessionId: sessionId,
    attendee: 'TOKENDATA',
    createdOn: new Date(),
    isDeleted: false,
  };
  return new SessionAttendees(data);
}

export function getAttendeesList() {
  return [
    new SessionAttendees({
      sessionId: sessionId,
      attendee: 'User1',
      createdOn: getDate('July 01, 2019 00:00:00'),
      isDeleted: false,
    }),
    new SessionAttendees({
      sessionId: sessionId,
      attendee: 'User2',
      createdOn: getDate('July 01, 2019 00:00:00'),
      isDeleted: false,
    }),
  ];
}
export function getTwilioMeetingOptions(
  twilioMeetingOptions: Partial<TwilioMeetingOptions>,
) {
  return {
    isScheduled: false,
    ...twilioMeetingOptions,
  };
}

export function getRoomInstance(): Promise<RoomInstance> {
  const roomInstance = sinon.createStubInstance(RoomInstance);
  roomInstance.sid = 'RMXXXXXXXX';
  return Promise.resolve(roomInstance);
}

export function getTwilioArchiveResponse(): Promise<RecordingInstance> {
  const recordingInstance = sinon.createStubInstance(RecordingInstance);
  recordingInstance.groupingSids = {
    roomSid: 'RMXXXXXXXX',
  };
  return Promise.resolve(recordingInstance);
}

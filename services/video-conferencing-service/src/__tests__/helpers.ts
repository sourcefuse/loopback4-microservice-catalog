import {SessionOptions, MeetingOptions, SessionResponse} from '../types';
import {VideoChatSession} from '../models';
import {VonageMeetingResponse} from '../providers/vonage';
import {VonageEnums} from '../enums/video-chat.enum';
import moment from 'moment';

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

export function getDatePastThreshold(threshold: number) {
  const currDate = Date.now()
  return moment(currDate).add(threshold + 5, 'm').toDate();
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
      expireTime: getDate('October 01, 2020 00:00:00'),
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

export function getVonageSessionResponse(sessionResponse: Partial<SessionResponse>) {
  return Object.assign(
    {
        sessionId: 'session-id',
        token: 'token'
    }
  )
}

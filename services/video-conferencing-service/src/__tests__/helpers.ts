import {SessionOptions} from '../types';
import {VideoChatSession} from '../models';

export function getVideoChatSession(
  videoChatSession: Partial<VideoChatSession>,
) {
  const data = Object.assign(
    {
      sessionId: 'dummy-session-id',
      meetingLink: 'dummy-meeting-link',
      isScheduled: true,
    },
    videoChatSession,
  );

  return new VideoChatSession(data);
}

export function getDate(dateString: string) {
  return new Date(dateString);
}

export function getSessionOptions(sessionOptions: Partial<SessionOptions>) {
  const data = Object.assign(
    {
      meetingLink: 'dummy-meeting-link',
      expireTime: getDate('October 01, 2020 00:00:00')
    },
    sessionOptions
  )

  return data;
}

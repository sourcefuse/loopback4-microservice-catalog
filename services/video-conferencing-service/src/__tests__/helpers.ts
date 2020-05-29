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

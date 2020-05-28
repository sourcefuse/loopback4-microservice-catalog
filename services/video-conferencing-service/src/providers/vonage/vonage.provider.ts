import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {MeetingOptions, SessionOptions} from '../../types';
import {VonageVideoChat} from './types';
import OpenTok = require('opentok'); // https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor() {
    const VONAGE_API_KEY = process.env.API_KEY;
    const VONAGE_API_SECRET = process.env.API_SECRET;

    if (!VONAGE_API_KEY || !VONAGE_API_SECRET) {
      throw new HttpErrors.BadRequest('Vonage API key or secret is not set');
    }
    this.VonageService = new OpenTok(VONAGE_API_KEY, VONAGE_API_SECRET);
  }

  VonageService: OpenTok;

  value() {
    return {
      getMeetingLink: async (options: MeetingOptions) => {
        return {
          mediaMode: VonageEnums.MediaMode.Routed,
          archiveMode: VonageEnums.ArchiveMode.Always,
          sessionId: 'dummy-session-id',
        };
      },
      getToken: async (options: SessionOptions) => {
        return {
          sessionId: 'dummy-session-id',
          token: 'first-token',
        };
      },
      stopMeeting: async (meetingId: string) => {},
      getArchives: async (archiveId: string | null) => {
        return {
          createdAt: 1234,
          duration: 1234,
          hasAudio: true,
          hasVideo: true,
          id: 'abc',
          name: 'rec-1',
          outputMode: VonageEnums.OutputMode.Composed,
          projectId: 123,
          reason: '',
          resolution: '',
          sessionId: 'session-1',
          size: 1,
          status: '',
          url: null,
        };
      },
      deleteArchive: async (archiveId: string) => {},
    };
  }
}

import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {MeetingOptions, SessionOptions} from '../../types';
import {VonageVideoChat, VonageConfig} from './types';
import OpenTok from 'opentok';
import { VonageBindings } from './keys';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @inject(VonageBindings.config)
    private readonly vonageConfig: VonageConfig
  ) {
    const { apiKey, apiSecret } = vonageConfig;
    if (!(apiKey && apiSecret)) {
      throw new HttpErrors.BadRequest('Vonage API key or secret is not set');
    }
    this.VonageService = new OpenTok(apiKey, apiSecret);
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

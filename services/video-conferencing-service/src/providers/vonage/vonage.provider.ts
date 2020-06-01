import { repository } from '@loopback/repository';
import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {SessionResponse, SessionOptions} from '../../types';
import {VonageVideoChat, VonageMeetingOptions, VonageMeetingResponse, VonageSessionOptions, VonageArchiveResponse, VonageArchiveList} from './types';
import OpenTok = require('opentok'); // https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import { VideoChatSessionRepository } from '../../repositories';
import moment from 'moment';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
  ) {
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
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions,
      ): Promise<VonageMeetingResponse> => {
        let mediaMode: VonageEnums.MediaMode = VonageEnums.MediaMode.Routed;
        let archiveMode: VonageEnums.ArchiveMode | undefined =
          VonageEnums.ArchiveMode.Always;
        let sessionId: string;

        if (meetingOptions.endToEndEncryption) {
          mediaMode = VonageEnums.MediaMode.Relayed;
        } else if (meetingOptions.enableArchiving) {
          mediaMode = VonageEnums.MediaMode.Routed;
          archiveMode = VonageEnums.ArchiveMode.Always;
        }

        const sessionCreationOptions = {
          mediaMode,
          archiveMode,
        };

        const createSession = () => {
          return new Promise<string>((resolve, reject) => {
            this.VonageService.createSession(
              sessionCreationOptions,
              (err: Error | null, session: OpenTok.Session | undefined) => {
                if (err) {
                  reject(err);
                }
                if (!session) {
                  console.log('Sessions not fomed');
                  throw new HttpErrors.BadRequest('Error creating session');
                } else {
                  sessionId = session.sessionId;
                  console.log('Session ID: ' + sessionId);
                  resolve(sessionId);
                }
              },
            );
          });
        };

        try {
          const id: string = await createSession();
          return {
            mediaMode: VonageEnums.MediaMode.Routed,
            archiveMode: VonageEnums.ArchiveMode.Always,
            sessionId: id,
          };
        } catch (err) {
          console.log(err);
          throw new HttpErrors.BadRequest('Error creating session');
        }
      },
      getToken: async (
        options: VonageSessionOptions,
      ): Promise<SessionResponse> => {
        // 1. fetch session id from meeting link
        const session = await this.videoChatSessionRepository.findOne({
          where: {meetingLink: options.meetingLink},
        });

        if (!session) {
          throw new HttpErrors.BadRequest(`This meeting doesn't exist`);
        }

        // check for schduled meeting:
        if (session.isScheduled && session.scheduleTime) {
          if (
            moment()
              .add(process.env.TIME_TO_START, 'minutes')
              .isBefore(session.scheduleTime)
          ) {
            return {
              sessionId: 'session-id',
              error: `schduled meeting can't be started now`,
            };
          }
        }
        // 2. generate token with correct options
        const tokenOptions: OpenTok.TokenOptions = {
          role: options.role,
          expireTime: options.expireTime.getTime(),
          data: options.data,
        };
        const token = this.VonageService.generateToken(
          session.sessionId,
          tokenOptions,
        );
        return {
          sessionId: session.sessionId,
          token,
        };
      },
      stopMeeting: async (meetingLink: string): Promise<void> => {
        // set end time for the session
        // 1. fetch session id from meeting link
        const session = await this.videoChatSessionRepository.findOne({
          where: {meetingLink},
        });

        if (!session) {
          throw new HttpErrors.BadRequest(`This meeting doesn't exist`);
        }

        await this.videoChatSessionRepository.updateById(session.id, {
          endTime: Date.now(),
        });
      },

      getArchives: async (
        archiveId: string | null,
      ): Promise<VonageArchiveResponse | VonageArchiveList> => {
        const archive = {
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
        if (!archiveId) {
          return {
            count: 1,
            items: [archive],
          };
        }
        return archive;
      },
      deleteArchive: async (archiveId: string): Promise<void> => {},
    };
  }
}

import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {SessionResponse} from '../../types';
import {VonageVideoChat, VonageMeetingOptions, VonageMeetingResponse, VonageSessionOptions, VonageArchiveResponse, VonageArchiveList} from './types';
import OpenTok = require('opentok'); // https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import { AuditLogsRepository } from '../../repositories';
import { repository } from '@loopback/repository';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @repository(AuditLogsRepository)
    public auditLogRepository: AuditLogsRepository,
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
        let mediaMode: VonageEnums.MediaMode;
        let archiveMode: VonageEnums.ArchiveMode | undefined =
          VonageEnums.ArchiveMode.Always;
        let sessionId: string;

        if (meetingOptions.endToEndEncryption) {
          mediaMode = VonageEnums.MediaMode.Relayed;
        } else if (meetingOptions.enableArchiving) {
          mediaMode = VonageEnums.MediaMode.Routed;
          archiveMode = VonageEnums.ArchiveMode.Always;
        } else {
          mediaMode = VonageEnums.MediaMode.Routed;
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
                  throw new HttpErrors.BadRequest('Error creating session');
                } else {
                  sessionId = session.sessionId;                  
                  resolve(sessionId);
                }
              },
            );
          });
        };

        try {
          const id: string = await createSession();

          const result  = {
            mediaMode: VonageEnums.MediaMode.Routed,
            archiveMode: VonageEnums.ArchiveMode.Always,
            sessionId: id,
          };

          this.auditLogRepository.create({
            action: 'session',
            actionType: 'createSession',
            actedEntity: id,
            actedAt: new Date().toString(),            
            after: result,
          });

          return result;

        } catch (err) {    

          this.auditLogRepository.create({
            action: 'session',
            actionType: 'createSession',
            actedEntity: '',
            actedAt: new Date().toString(),            
            after: err,
          });      
          throw new HttpErrors.BadRequest('Error creating session');
        }
      },
      getToken: async (
        sessionId: string,
        options: VonageSessionOptions,
      ): Promise<SessionResponse> => {

        // generates token with correct options
        const tokenOptions: OpenTok.TokenOptions = {
          role: options.role,
          expireTime: options.expireTime.getTime(),
          data: options.data,
        };
        const token = this.VonageService.generateToken(
          sessionId,
          tokenOptions,
        );

        this.auditLogRepository.create({
          action: 'session',
          actionType: 'generateToken',
          before: {
            sessionId,
            options
          },
          after: {
            sessionId,
            token,
          },
        });
        
        return {
          sessionId,
          token,
        };
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

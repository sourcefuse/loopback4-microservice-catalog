import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import { SessionResponse, SessionOptions,  ArchiveResponse, ArchiveResponseList } from '../../types';
import {
  VonageMeetingResponse,
  VonageMeetingOptions,
  VonageVideoChat,
  VonageSessionOptions,
} from './types';
import OpenTok = require('opentok'); // https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import { promisify } from 'util';
import { ArchiveMode } from 'opentok'; 
import { AuditLogsRepository } from '../../repositories';
import { repository } from '@loopback/repository';
export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(@repository(AuditLogsRepository)
    public auditLogRepository: AuditLogsRepository) {
    const { VONAGE_API_KEY, VONAGE_API_SECRET } = process.env;

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
        let archiveMode: ArchiveMode = VonageEnums.ArchiveMode.Always;
        let sessionId: string;

        if (meetingOptions.endToEndEncryption) {
          mediaMode = VonageEnums.MediaMode.Relayed;
        } else if (meetingOptions.enableArchiving) {
          mediaMode = VonageEnums.MediaMode.Routed;
          archiveMode = VonageEnums.ArchiveMode.Always;
        } else {
          // nothing to do.
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
        archiveId: string | null
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        const getArchive = promisify(this.VonageService.getArchive);
        const listArchives = promisify(this.VonageService.listArchives);
        if (archiveId) {
          const archive = await getArchive(archiveId);
          return {
            name: archive?.name,
            sessionId: archive?.sessionId,
            metaData: (archive ?? null) as object,
          };
        }
        let archives = await listArchives({});
        archives = archives?.length ? archives: [];
        const items = [];
        for (const archive of archives) {
            items.push({
              name: archive.name,
              sessionId: archive.sessionId,
              metaData: archive as object,
            });
        }
        return {
          count: archives?.length ?? 0,
          items,
        };
      },
      // TODO: startArchive and stopArchive needs to be uncommented/modified later
      // startArchive: async (sessionId: string, archiveOptions: ArchiveOptions): Promise<Archive | undefined> => {
      //   const startArchive = promisify(this.VonageService.startArchive);
      //   return startArchive(sessionId, archiveOptions);
      // },
      // stopArchive: async (archiveId: string): Promise <Archive | undefined> => {
      //   const stopArchive = promisify(this.VonageService.stopArchive);
      //   return stopArchive(archiveId);
      // },
      deleteArchive: async (archiveId: string): Promise<void> => {
        const deleteArchive = promisify(this.VonageService.deleteArchive);
        return deleteArchive(archiveId);
      },
    };
  }
}
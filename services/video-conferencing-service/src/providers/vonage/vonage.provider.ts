import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {SessionOptions, ArchiveResponse, ArchiveResponseList, SessionResponse} from '../../types';
import {VonageVideoChat, VonageConfig, VonageMeetingOptions, VonageMeetingResponse} from './types';
import OpenTok from 'opentok';
import { repository } from '@loopback/repository';
import { AuditLogsRepository } from '../../repositories';
import { VonageBindings } from './keys';
import { promisify } from 'util';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @inject(VonageBindings.config)
    private readonly vonageConfig: VonageConfig,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository
  ) {
    const {apiKey, apiSecret} = vonageConfig;
    if (!(apiKey && apiSecret)) {
      throw new HttpErrors.BadRequest('Vonage API key or secret is not set');
    }
    this.VonageService = new OpenTok(apiKey, apiSecret);
  }

  VonageService: OpenTok;

  value() {
    return {
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions,
      ): Promise<VonageMeetingResponse> => {
        let mediaMode: VonageEnums.MediaMode = VonageEnums.MediaMode.Routed;
        let archiveMode: VonageEnums.ArchiveMode = VonageEnums.ArchiveMode.Manual;
        let sessionId: string;

        const { endToEndEncryption, enableArchiving } = meetingOptions;

        if (endToEndEncryption && enableArchiving) {
          throw new HttpErrors.BadRequest('End to end Encryption along with archiving is not possible');
        } else if (endToEndEncryption) {
          mediaMode = VonageEnums.MediaMode.Relayed;
        } else if (enableArchiving) {
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
                  throw new HttpErrors.InternalServerError('Error creating session');
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
          return {
            mediaMode: sessionCreationOptions.mediaMode,
            archiveMode: sessionCreationOptions.archiveMode,
            sessionId: id,
          };
        } catch (err) {
          throw new HttpErrors.InternalServerError('Error creating session');
        }
      },
      getToken: async (sessionId: string, options: SessionOptions): Promise<SessionResponse> => {
        const token = this.VonageService.generateToken(sessionId, {});
        return {
          sessionId,
          token,
        };
      },
      stopMeeting: async (meetingId: string) => {},

      getArchives: async (
        archiveId: string | null
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        const getArchive = promisify(this.VonageService.getArchive);
        const listArchives = promisify(this.VonageService.listArchives);
        if (archiveId) {
          const archive = await getArchive(archiveId);
          return {
            name: archive?.name,
            sessionId: archive?.sessionId as string,
            metaData: (archive ?? null) as object,
          };
        }
        let archives = await listArchives({});
        archives = archives?.length ? archives: [];
        const items = [];
        for (const archive of archives) {
            items.push({
              name: archive.name,
              sessionId: archive.sessionId as string,
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
      deleteArchive: async (archiveId: string) => {},
    };
  }
}

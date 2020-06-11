import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VonageEnums} from '../../enums/video-chat.enum';
import {ArchiveResponse, ArchiveResponseList, SessionResponse} from '../../types';
import {VonageVideoChat, VonageConfig, VonageMeetingOptions, VonageMeetingResponse, VonageSessionOptions} from './types';
import OpenTok from 'opentok';
import { repository } from '@loopback/repository';
import { AuditLogsRepository } from '../../repositories';
import { VonageBindings } from './keys';
import { promisify } from 'util';
import moment from 'moment';

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
          return new Promise<OpenTok.Session>((resolve, reject) => {
            this.VonageService.createSession(
              sessionCreationOptions,
              (err: Error | null, session: OpenTok.Session | undefined) => {
                if (err) {
                  reject(err);
                }
                if (!session) {
                  throw new HttpErrors.InternalServerError('Error creating session');
                } else {
                  resolve(session);
                }
              },
            );
          });
        };

        try {
          const session = await createSession();
          this.auditLogRepository.create({
            action: 'session',
            actionType: 'create-session',
            before: sessionCreationOptions,
            after: session,
            actedAt: moment().format(),
            actedEntity: session.sessionId,
          });
          return {
            mediaMode: sessionCreationOptions.mediaMode,
            archiveMode: sessionCreationOptions.archiveMode,
            sessionId: session.sessionId,
          };
        } catch (err) {
          this.auditLogRepository.create({
            action: 'session',
            actionType: 'create-session',
            before: sessionCreationOptions,
            after: err.stack,
            actedAt: moment().format(),
            actedEntity: '',
          });
          throw new HttpErrors.InternalServerError('Error creating session');
        }
      },
      getToken: async (sessionId: string, options: VonageSessionOptions): Promise<SessionResponse> => {
        try {
        const { expireTime, role, data } = options;
        const requestPayload: OpenTok.TokenOptions = {
          expireTime: expireTime ? moment(expireTime).unix() : undefined,
          role: role ?? undefined,
          data: data ?? undefined,
        };
        const token = this.VonageService.generateToken(sessionId, requestPayload);

        this.auditLogRepository.create({
          action: 'session',
          actionType: 'get-token',
          before: {
            sessionId,
            ...options,
          },
          after: {
            token,
          },
          actedAt: moment().format(),
          actedEntity: token,
        });
        return {
          sessionId,
          token,
        };

      } catch (error) {
        this.auditLogRepository.create({
          action: 'session',
          actionType: 'get-token',
          before: {
            sessionId,
            ...options,
          },
          after: {
            errorStack: error.stack,
          },
          actedAt: moment().format(),
        });
        throw new HttpErrors.InternalServerError('Error occured while generating Token');
      }

      },

      getArchives: async (
        archiveId: string | null
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        try {
        const getArchive = promisify(this.VonageService.getArchive);
        const listArchives = promisify(this.VonageService.listArchives);
        let archiveResult: ArchiveResponse | ArchiveResponseList;
        if (archiveId) {
          const archive = await getArchive(archiveId);
          archiveResult = {
            name: archive?.name,
            sessionId: archive?.sessionId as string,
            metaData: (archive ?? null) as object,
          };
        } else { 
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
        archiveResult = {
          count: archives?.length ?? 0,
          items,
        };
       }
       this.auditLogRepository.create({
          action: 'archive',
          actionType: archiveId ? 'getArchive' : 'getArchives',
          before: archiveId ? { archiveId } : {},
          after: archiveResult,
          actedAt: moment().format(),
       });
       return archiveResult;
      } catch (error) {
        this.auditLogRepository.create({
          action: 'archive',
          actionType: archiveId ? 'getArchive' : 'getArchives',
          before: archiveId ? { archiveId } : {},
          after: { errorStack: error.stack },
          actedAt: moment().format(),
       });
       throw new HttpErrors.InternalServerError('Error occured while fetching archive(s)');
      }
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
      deleteArchive: async (archiveId: string) => {
        try {
          const deleteArchive = promisify(this.VonageService.deleteArchive);
          await deleteArchive(archiveId);
          this.auditLogRepository.create({
            action: 'archive',
            actionType: 'delete-archive',
            before: {
              archiveId,
            },
            after: { response: 'Archive Deletion Successful!' },
            actedAt: moment().format(),
          });
        } catch (error) {
          this.auditLogRepository.create({
            action: 'archive',
            actionType: 'delete-archive',
            before: {
              archiveId,
            },
            after: { errorStack: error.stack },
            actedAt: moment().format(),
          });
          throw new HttpErrors.InternalServerError('Error occured while deleting an archive');
        }
      },
    };
  }
}

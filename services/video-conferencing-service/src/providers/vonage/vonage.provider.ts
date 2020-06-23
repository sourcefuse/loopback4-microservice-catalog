import {Provider, service} from '@loopback/core';
import {
  ArchiveResponse,
  ArchiveResponseList,
  SessionResponse,
} from '../../types';
import {
  VonageVideoChat,
  VonageMeetingOptions,
  VonageMeetingResponse,
  VonageSessionOptions,
  VonageS3TargetOptions,
  VonageAzureTargetOptions,
} from './types';

import {VonageService} from './vonage.service';
import {AuditLogsRepository} from '../../repositories';
import {repository} from '@loopback/repository';
import moment from 'moment';
import {HttpErrors} from '@loopback/rest';

export class VonageProvider implements Provider<VonageVideoChat> {
  constructor(
    @service(VonageService)
    private readonly vonageService: VonageService,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository,
  ) {}
  value() {
    return {
      getMeetingLink: async (
        meetingOptions: VonageMeetingOptions,
      ): Promise<VonageMeetingResponse> => {
        try {
          const response = await this.vonageService.getMeetingLink(
            meetingOptions,
          );
          await this.auditLogRepository.create({
            action: 'session',
            actionType: 'create-session',
            before: meetingOptions,
            after: response,
            actedAt: moment().format(),
          });
          return response;
        } catch (error) {
          await this.auditLogRepository.create({
            action: 'session',
            actionType: 'create-session',
            before: meetingOptions,
            after: {errorStack: error.stack},
            actedAt: moment().format(),
          });
          throw new HttpErrors.InternalServerError('Error creating session');
        }
      },
      getToken: async (
        sessionId: string,
        options: VonageSessionOptions,
      ): Promise<SessionResponse> => {
        try {
          const response = await this.vonageService.getToken(
            sessionId,
            options,
          );
          await this.auditLogRepository.create({
            action: 'session',
            actionType: 'get-token',
            before: {
              sessionId,
              ...options,
            },
            after: {
              token: response.token,
            },
            actedAt: moment().format(),
          });
          return response;
        } catch (error) {
          await this.auditLogRepository.create({
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
          throw new HttpErrors.InternalServerError(
            'Error occured while generating Token',
          );
        }
      },
      getArchives: async (
        archiveId: string | null,
      ): Promise<ArchiveResponse | ArchiveResponseList> => {
        try {
          const response = await this.vonageService.getArchives(archiveId);
          await this.auditLogRepository.create({
            action: 'archive',
            actionType: archiveId ? 'getArchive' : 'getArchives',
            before: archiveId ? {archiveId} : {},
            after: response,
            actedAt: moment().format(),
          });
          return response;
        } catch (error) {
          await this.auditLogRepository.create({
            action: 'archive',
            actionType: archiveId ? 'getArchive' : 'getArchives',
            before: archiveId ? {archiveId} : {},
            after: {errorStack: error.stack},
            actedAt: moment().format(),
          });
          throw new HttpErrors.InternalServerError(
            'Error occured while fetching archive(s)',
          );
        }
      },
      deleteArchive: async (archiveId: string) => {
        try {
          await this.vonageService.deleteArchive(archiveId);
          await this.auditLogRepository.create({
            action: 'archive',
            actionType: 'delete-archive',
            before: {
              archiveId,
            },
            after: {response: 'Archive Deletion Successful!'},
            actedAt: moment().format(),
          });
        } catch (error) {
          await this.auditLogRepository.create({
            action: 'archive',
            actionType: 'delete-archive',
            before: {
              archiveId,
            },
            after: {errorStack: error.stack},
            actedAt: moment().format(),
          });
          throw new HttpErrors.InternalServerError(
            'Error occured while deleting an archive',
          );
        }
      },
      setUploadTarget: async (
        storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
      ): Promise<void> => {
        const auditLogAction = 'archive';
        const auditLogActionType = 'set-storage-target';
        try {
          await this.vonageService.setUploadTarget(storageConfig);
          await this.auditLogRepository.create({
            action: auditLogAction,
            actionType: auditLogActionType,
            before: storageConfig,
            after: {response: 'Storage Target Success'},
            actedAt: moment().format(),
          });
        } catch (error) {
          await this.auditLogRepository.create({
            action: auditLogAction,
            actionType: auditLogActionType,
            before: storageConfig,
            after: {errorStack: error.stack},
            actedAt: moment().format(),
          });
          throw new HttpErrors.InternalServerError(
            'Error Occured while setting storage target',
          );
        }
      },
    };
  }
}

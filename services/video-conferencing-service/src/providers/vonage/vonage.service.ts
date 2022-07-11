// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  VonageVideoChat,
  VonageSessionOptions,
  VonageS3TargetOptions,
  VonageAzureTargetOptions,
  VonageMeetingOptions,
  VonageMeetingResponse,
  VonageConfig,
  VonageSessionWebhookPayload,
} from '.';
import {
  SessionResponse,
  ArchiveResponseList,
  ArchiveResponse,
} from '../../types';
import OpenTok from 'opentok';
import moment from 'moment';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {sign} from 'jsonwebtoken';
import axios from 'axios';
import {VonageEnums} from '../../enums';
import {VonageBindings} from './keys';
import {inject} from '@loopback/core';
import {ExternalStorageName, SessionAttendees, VideoChatFeatures} from '../..';
import {SessionAttendeesRepository} from '../../repositories';
import {repository} from '@loopback/repository';

export class VonageService implements VonageVideoChat {
  VonageClient: OpenTok;
  constructor(
    @inject(VonageBindings.config, {optional: true})
    private readonly vonageConfig: VonageConfig,
    @repository(SessionAttendeesRepository)
    private readonly sessionAttendeesRepository: SessionAttendeesRepository,
  ) {
    const {apiKey, apiSecret} = vonageConfig;
    if (!(apiKey && apiSecret)) {
      throw new HttpErrors.BadRequest('Vonage API key or secret is not set');
    }
    this.VonageClient = new OpenTok(apiKey, apiSecret);
  }
  async getMeetingLink(
    meetingOptions: VonageMeetingOptions,
  ): Promise<VonageMeetingResponse> {
    let mediaMode: VonageEnums.MediaMode = VonageEnums.MediaMode.Routed;
    let archiveMode: VonageEnums.ArchiveMode = VonageEnums.ArchiveMode.Manual;

    const {endToEndEncryption, enableArchiving} = meetingOptions;

    if (endToEndEncryption && enableArchiving) {
      throw new HttpErrors.BadRequest(
        'End to end Encryption along with archiving is not possible',
      );
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
        this.VonageClient.createSession(
          sessionCreationOptions,
          (err: Error | null, session: OpenTok.Session | undefined) => {
            if (err) {
              reject(err);
            }
            if (!session) {
              throw new HttpErrors.InternalServerError(
                'Error creating session',
              );
            } else {
              resolve(session);
            }
          },
        );
      });
    };

    const sessionResponse = await createSession();
    return {
      mediaMode: sessionCreationOptions.mediaMode,
      archiveMode: sessionCreationOptions.archiveMode,
      sessionId: sessionResponse.sessionId,
      isArchived: Boolean(sessionCreationOptions.archiveMode),
    };
  }
  async getToken(
    sessionId: string,
    options: VonageSessionOptions,
  ): Promise<SessionResponse> {
    const {expireTime, role, data} = options;
    const requestPayload: OpenTok.TokenOptions = {
      expireTime: expireTime ? moment(expireTime).unix() : undefined,
      role: role ?? undefined,
      data: data ?? undefined,
    };
    const token = this.VonageClient.generateToken(sessionId, requestPayload);
    return {
      sessionId,
      token,
    };
  }
  getFeatures(): VideoChatFeatures {
    return {
      archive: true,
      schedule: true,
    };
  }
  async getArchives(
    archiveId: string | null,
  ): Promise<ArchiveResponse | ArchiveResponseList> {
    const getArchive = promisify(this.VonageClient.getArchive);
    const listArchives = promisify(this.VonageClient.listArchives);
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
      archives = archives?.length ? archives : [];
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
    return archiveResult;
  }
  async deleteArchive(archiveId: string) {
    const deleteArchive = promisify(this.VonageClient.deleteArchive);
    return deleteArchive(archiveId);
  }
  async setUploadTarget(
    storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
  ): Promise<void> {
    const {apiKey, apiSecret} = this.vonageConfig;
    const ttl = 200;
    const jwtPayload = {
      iss: apiKey,
      ist: 'project',
      iat: moment().unix(),
      exp: moment().add(ttl, 'seconds').unix(),
    };

    const token = sign(jwtPayload, apiSecret);
    let type = '';
    const credentials = {};
    if (storageConfig.name === ExternalStorageName.AWSS3) {
      const accessKey = this.vonageConfig.awsAccessKey;
      const secretKey = this.vonageConfig.awsSecretKey;
      if (!accessKey || !secretKey) {
        throw new HttpErrors.InternalServerError(
          `Missing Aws S3 credentials for setting vongae upload target`,
        );
      }
      const {bucket, endpoint} = storageConfig as VonageS3TargetOptions;
      if (bucket) {
        type = 'S3';
        Object.assign(credentials, {
          accessKey,
          secretKey,
          bucket,
          endpoint,
        });
      }
    } else if (storageConfig.name === ExternalStorageName.AZURE) {
      const accountKey = this.vonageConfig.azureAccountKey;
      const container = this.vonageConfig.azureAccountContainer;
      const {accountName, domain} = storageConfig as VonageAzureTargetOptions;
      if (!accountKey || !container) {
        throw new HttpErrors.InternalServerError(
          `Missing Azure credentials for setting vongae upload target`,
        );
      }
      if (accountName) {
        type = 'Azure';
        Object.assign(credentials, {
          accountName,
          accountKey,
          container,
          domain,
        });
      }
    } else {
      //do nothing
    }
    await axios({
      url: `https://api.opentok.com/v2/project/${this.vonageConfig.apiKey}/archive/storage`,
      method: 'put',
      data: {
        type,
        config: credentials,
        fallback: storageConfig.fallback,
      },
      headers: {
        'X-OPENTOK-AUTH': token,
      },
    });
  }

  async checkWebhookPayload(
    webhookPayload: VonageSessionWebhookPayload,
  ): Promise<void> {
    try {
      const {
        connection: {data},
        event,
        sessionId,
      } = webhookPayload;

      const sessionAttendeeDetail =
        await this.sessionAttendeesRepository.findOne({
          where: {
            sessionId: sessionId,
            attendee: data,
          },
        });
      if (!sessionAttendeeDetail) {
        if (event === VonageEnums.SessionWebhookEvents.ConnectionCreated) {
          await this.sessionAttendeesRepository.create({
            sessionId: sessionId,
            attendee: data,
            createdOn: new Date(),
            isDeleted: false,
            extMetadata: {webhookPayload: webhookPayload},
          });
        }
      } else {
        const updatedAttendee = {
          modifiedOn: new Date(),
          isDeleted: sessionAttendeeDetail.isDeleted,
          extMetadata: {webhookPayload: webhookPayload},
        };
        if (event === VonageEnums.SessionWebhookEvents.ConnectionCreated) {
          updatedAttendee.isDeleted = false;
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else if (event === VonageEnums.SessionWebhookEvents.StreamCreated) {
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else if (event === VonageEnums.SessionWebhookEvents.StreamDestroyed) {
          await this.processStreamDestroyedEvent(
            webhookPayload,
            sessionAttendeeDetail,
            updatedAttendee,
          );
        } else if (
          event === VonageEnums.SessionWebhookEvents.ConnectionDestroyed
        ) {
          updatedAttendee.isDeleted = true;
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else {
          //DO NOTHING
        }
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Error occured triggering webhook event',
      );
    }
  }
  async processStreamDestroyedEvent(
    webhookPayload: VonageSessionWebhookPayload,
    sessionAttendeeDetail: SessionAttendees,
    updatedAttendee: Partial<SessionAttendees>,
  ) {
    if (
      webhookPayload.reason === 'forceUnpublished' ||
      webhookPayload.reason === 'mediaStopped'
    ) {
      await this.sessionAttendeesRepository.updateById(
        sessionAttendeeDetail.id,
        updatedAttendee,
      );
    } else {
      updatedAttendee.isDeleted = true;
      await this.sessionAttendeesRepository.updateById(
        sessionAttendeeDetail.id,
        updatedAttendee,
      );
    }
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import {sign} from 'jsonwebtoken';
import moment from 'moment';
import OpenTok from 'opentok';
import {promisify} from 'util';
import {
  VonageAzureTargetOptions,
  VonageConfig,
  VonageMeetingOptions,
  VonageMeetingResponse,
  VonageS3TargetOptions,
  VonageSessionOptions,
  VonageSessionWebhookPayload,
  VonageVideoChat,
} from '.';
import {ExternalStorageName, SessionAttendees, VideoChatFeatures} from '../..';
import {VonageEnums} from '../../enums';
import {SessionAttendeesRepository} from '../../repositories';
import {
  ArchiveResponse,
  ArchiveResponseList,
  SessionResponse,
} from '../../types';
import {VonageBindings} from './keys';

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
      isArchived: enableArchiving,
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
  /**
   * The function `setUploadTarget` asynchronously sets the upload target for storage using Vonage S3
   * or Azure options.
   * @param {VonageS3TargetOptions | VonageAzureTargetOptions} storageConfig - The `storageConfig`
   * parameter in the `setUploadTarget` function can be of type `VonageS3TargetOptions` or
   * `VonageAzureTargetOptions`. These types likely contain configuration options specific to storing
   * uploaded files in either an S3 bucket (for Amazon S3) or
   */
  async setUploadTarget(
    storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
  ): Promise<void> {
    const token = this._createVonageJwtToken();

    const {type, credentials} = this._buildStorageCredentials(storageConfig);

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

  /**
   * The function `_createVonageJwtToken` generates a JWT token using Vonage API key and secret with a
   * specified time-to-live (TTL) of 200 seconds.
   * @returns A Vonage JWT token is being returned.
   */
  private _createVonageJwtToken(): string {
    const {apiKey, apiSecret} = this.vonageConfig;
    const ttl = 200;

    const jwtPayload = {
      iss: apiKey,
      ist: 'project',
      iat: moment().unix(),
      exp: moment().add(ttl, 'seconds').unix(),
    };

    return sign(jwtPayload, apiSecret);
  }

  /**
   * The function `_buildStorageCredentials` determines the type of storage credentials based on the
   * provided storage configuration.
   * @param {VonageS3TargetOptions | VonageAzureTargetOptions} storageConfig - The
   * `_buildStorageCredentials` function takes in a `storageConfig` parameter of type
   * `VonageS3TargetOptions` or `VonageAzureTargetOptions`. It then checks the `name` property of the
   * `storageConfig` object to determine the type of external storage (AWS S
   * @returns The `_buildStorageCredentials` method returns an object with two properties: `type` and
   * `credentials`. The `type` property is a string, and the `credentials` property is a record
   * containing key-value pairs of any type. The specific values of these properties are determined
   * based on the `storageConfig` parameter passed to the method.
   */
  private _buildStorageCredentials(
    storageConfig: VonageS3TargetOptions | VonageAzureTargetOptions,
  ): {type: string; credentials: AnyObject} {
    switch (storageConfig.name) {
      case ExternalStorageName.AWSS3:
        return this._getAwsCredentials(storageConfig as VonageS3TargetOptions);
      case ExternalStorageName.AZURE:
        return this._getAzureCredentials(
          storageConfig as VonageAzureTargetOptions,
        );
      default:
        throw new HttpErrors.BadRequest('Unsupported storage type');
    }
  }

  /**
   * The function `_getAwsCredentials` retrieves AWS S3 credentials for setting a Vonage upload target.
   * @param {VonageS3TargetOptions} config - The `_getAwsCredentials` function takes in a
   * `VonageS3TargetOptions` object as the `config` parameter. This object typically contains
   * properties such as `bucket` and `endpoint` for configuring an AWS S3 bucket.
   * @returns an object with a `type` property set to 'S3' and a `credentials` property containing the
   * AWS access key, secret key, S3 bucket name, and endpoint.
   */
  private _getAwsCredentials(config: VonageS3TargetOptions): {
    type: string;
    credentials: AnyObject;
  } {
    const {awsAccessKey: accessKey, awsSecretKey: secretKey} =
      this.vonageConfig;

    if (!accessKey || !secretKey) {
      throw new HttpErrors.InternalServerError(
        `Missing AWS S3 credentials for setting Vonage upload target`,
      );
    }

    const {bucket, endpoint} = config;

    if (!bucket) {
      throw new HttpErrors.BadRequest('S3 bucket name is required');
    }

    return {
      type: 'S3',
      credentials: {accessKey, secretKey, bucket, endpoint},
    };
  }

  /**
   * The function `_getAzureCredentials` retrieves Azure credentials for setting Vonage upload target.
   * @param {VonageAzureTargetOptions} config - The `config` parameter in the `_getAzureCredentials`
   * function refers to an object of type `VonageAzureTargetOptions`. This object likely contains
   * properties such as `accountName` and `domain` that are needed to retrieve Azure credentials for
   * setting up a Vonage upload target.
   * @returns an object with a `type` property set to 'Azure' and a `credentials` property containing
   * the `accountName`, `accountKey`, `container`, and `domain` values.
   */
  private _getAzureCredentials(config: VonageAzureTargetOptions): {
    type: string;
    credentials: AnyObject;
  } {
    const {azureAccountKey: accountKey, azureAccountContainer: container} =
      this.vonageConfig;

    const {accountName, domain} = config;

    if (!accountKey || !container) {
      throw new HttpErrors.InternalServerError(
        `Missing Azure credentials for setting Vonage upload target`,
      );
    }

    if (!accountName) {
      throw new HttpErrors.BadRequest('Azure account name is required');
    }

    return {
      type: 'Azure',
      credentials: {accountName, accountKey, container, domain},
    };
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

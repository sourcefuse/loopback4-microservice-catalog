import {inject, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SuccessResponse} from '@sourceloop/core';
import {
  PubnubBindings,
  PubNubMessage,
  PubNubSubscriberType,
} from 'loopback4-notifications/pubnub';
import Pubnub from 'pubnub';
import {Config, PubNubNotification} from '../types';

export class PubNubProvider implements Provider<PubNubNotification> {
  constructor(
    @inject(PubnubBindings.Config, {
      optional: true,
    })
    private readonly pnConfig?: Pubnub.PubnubConfig,
  ) {
    if (this.pnConfig) {
      this.pubnubService = new Pubnub(this.pnConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('PUBNUB_CONFIG_MISSING');
    }
  }

  pubnubService: Pubnub;
  // sonarignore:start
  value() {
    return {
      publish: async (message: PubNubMessage) => {
        if (message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest('MESSAGE_RECIEVER_NOT_FOUND');
        }
        const publishes = message.receiver.to.map(receiver => {
          const publishConfig: Pubnub.PublishParameters = {
            channel: '',
            message: {
              title: message.subject,
              description: message.body,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pn_gcm: {
                data: Object.assign(
                  {
                    title: message.subject,
                    description: message.body,
                  },
                  message.options,
                ),
              },
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pn_apns: Object.assign(
                {
                  aps: {
                    alert: message.body,
                    key: message.subject,
                    sound: message?.options?.sound
                      ? message.options.sound
                      : 'default',
                  },
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  pn_push: [
                    {
                      targets: [
                        {
                          environment: process.env.PUBNUB_APNS2_ENV,
                          topic: process.env.PUBNUB_APNS2_BUNDLE_ID,
                        },
                      ],
                      version: 'v2',
                    },
                  ],
                },
                message.options,
              ),
            },
          };
          if (receiver.type === PubNubSubscriberType.Channel) {
            publishConfig.channel = receiver.id;
          }

          return this.pubnubService.publish(publishConfig);
        });

        await Promise.all(publishes);
      },
      grantAccess: async (config: Config) => {
        if (config.options?.token && config.options.ttl) {
          const publishConfig: Pubnub.GrantParameters = {
            channels: config.receiver?.to.map(receiver => receiver.id),
            channelGroups: config.channelGroups,
            read: config.options.allowRead || true,
            write: config.options.allowWrite || false,
            ttl: config.options.ttl,
          };
          await this.pubnubService.grant(publishConfig);
          return {
            ttl: config.options.ttl,
          };
        }
        throw new HttpErrors.BadRequest('AUTH_TOKEN_OR_TTL_NOT_FOUND');
      },
      revokeAccess: async (config: Config) => {
        if (config.options?.token) {
          const publishConfig: Pubnub.GrantParameters = {
            channels: config.receiver?.to.map(receiver => receiver.id),
            channelGroups: config.channelGroups,
            authKeys: [config.options.token],
            read: false,
            write: false,
          };
          await this.pubnubService.grant(publishConfig);
          return {
            success: true,
          };
        }
        throw new HttpErrors.BadRequest('AUTH_TOKEN_NOT_FOUND');
      },
      setState: async (params: Pubnub.SetStateParameters, uuid?: string) => {
        if (uuid && this.pnConfig) {
          const config = this.pnConfig;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config.uuid = uuid;
          const pubnub = new Pubnub(config);
          await pubnub.setState(params);
        } else {
          await this.pubnubService.setState(params);
        }
        return new SuccessResponse({
          success: true,
        });
      },
      setUUID: async (uuid: string) => {
        this.pubnubService.setUUID(uuid);
        return new SuccessResponse({
          success: true,
        });
      },
      getState: async (params: Pubnub.GetStateParameters) => {
        return new Promise<Pubnub.GetStateResponse>((resolve, reject) => {
          this.pubnubService.getState(params, (status, resp) => {
            if (status.error) {
              reject(status);
            }
            resolve(resp);
          });
        });
      },
      makeChannelGroup: async (params: Pubnub.AddChannelParameters) => {
        return new Promise<{}>((resolve, reject) => {
          this.pubnubService.channelGroups.addChannels(params, status => {
            if (status.error) {
              reject(status.error);
            }
            resolve(status);
          });
        });
      },
      listChannelsInGroup: async (groupName: string) => {
        return new Promise<Pubnub.ListChannelsResponse>((resolve, reject) => {
          this.pubnubService.channelGroups.listChannels(
            {
              channelGroup: groupName,
            },
            (status, resp) => {
              if (status.error) {
                reject(status);
              }
              resolve(resp);
            },
          );
        });
      },
      deleteGroup: async (groupName: string) => {
        return this.pubnubService.channelGroups.deleteGroup({
          channelGroup: groupName,
        });
      },
      removeChannel: async (params: Pubnub.RemoveChannelParameters) =>
        this.pubnubService.channelGroups.removeChannels(params),
      hereNow: async (params: Pubnub.HereNowParameters) => {
        return new Promise<Pubnub.HereNowResponse>((resolve, reject) => {
          this.pubnubService.hereNow(params, (status, resp) => {
            if (status.error) {
              reject(status);
            }
            resolve(resp);
          });
        });
      },
      subscribe: async (params: Pubnub.SubscribeParameters) => {
        this.pubnubService.subscribe(params);
        return new SuccessResponse({
          success: true,
        });
      },
      setChannelMetaData: async (
        params: Pubnub.SetChannelMetadataParameters<AnyObject>,
      ) => {
        return new Promise<Pubnub.SetChannelMetadataResponse<AnyObject>>(
          (resolve, reject) => {
            this.pubnubService.objects.setChannelMetadata(
              params,
              (status, resp) => {
                if (status.error) {
                  reject(status);
                }
                resolve(resp);
              },
            );
          },
        );
      },
      getChannelMetaData: async (
        params: Pubnub.GetChannelMetadataParameters,
      ) => {
        return new Promise<Pubnub.GetChannelMetadataResponse<AnyObject>>(
          (resolve, reject) => {
            this.pubnubService.objects.getChannelMetadata(
              params,
              (status, resp) => {
                if (status.error) {
                  reject(status);
                }
                resolve(resp);
              },
            );
          },
        );
      },
    };
  }
  // sonarignore:end
}

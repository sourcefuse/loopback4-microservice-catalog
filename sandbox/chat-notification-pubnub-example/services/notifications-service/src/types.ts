import { AnyObject } from '@loopback/repository';
import { SuccessResponse } from '@sourceloop/core';
import { MessageOptions, MessageType, Receiver } from 'loopback4-notifications';
import { PubNubMessage } from 'loopback4-notifications/dist/providers/push/pubnub/types';
import { PushNotification } from 'loopback4-notifications/dist/providers/push/types';
import Pubnub from 'pubnub';
import { Notification, NotificationUser } from './models';
export interface PubNubNotification extends PushNotification {
  publish(message: PubNubMessage): Promise<void>;
  subscribe(params: Pubnub.SubscribeParameters): Promise<SuccessResponse>;
  setUUID(uuid: string): Promise<SuccessResponse>;
  grantAccess(config: Config): Promise<{}>;
  revokeAccess(config: Config): Promise<{}>;
  setState(
    params: Pubnub.SetStateParameters,
    uuid?: string,
  ): Promise<SuccessResponse>;
  makeChannelGroup(params: Pubnub.AddChannelParameters): Promise<{}>;
  listChannelsInGroup(groupName: string): Promise<Pubnub.ListChannelsResponse>;
  deleteGroup(groupName: string): Promise<{}>;
  removeChannel(params: Pubnub.RemoveChannelParameters): Promise<{}>;
  getState(params: Pubnub.GetStateParameters): Promise<Pubnub.GetStateResponse>;
  hereNow(params: Pubnub.HereNowParameters): Promise<Pubnub.HereNowResponse>;
  setChannelMetaData(
    params: Pubnub.SetChannelMetadataParameters<AnyObject>,
  ): Promise<Pubnub.SetChannelMetadataResponse<AnyObject>>;
  getChannelMetaData(
    params: Pubnub.GetChannelMetadataParameters,
  ): Promise<Pubnub.GetChannelMetadataResponse<AnyObject>>;
}
export interface Config {
  receiver?: Receiver;
  channelGroups?: string[];
  type: MessageType;
  options?: MessageOptions;
}
export interface INotificationUserManager {
  getNotifUsers(
    notif: Notification,
    notificationUsersData: NotificationUser[],
  ): Promise<NotificationUser[]>;
}

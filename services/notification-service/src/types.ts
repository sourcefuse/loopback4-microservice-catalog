import {IAuthUserWithPermissions, IServiceConfig} from '@sourceloop/core';
import {Config, Subscriber} from 'loopback4-notifications';

export interface IChannelManager {
  isChannelAccessAllowed(
    user: IAuthUserWithPermissions,
    config: Config,
  ): boolean;
}

export interface INotificationUserManager {
  getUserId(receiver: Subscriber): string;
}

export interface INotifServiceConfig extends IServiceConfig {
  useCustomEmailProvider: boolean;
  useCustomSMSProvider: boolean;
  useCustomPushProvider: boolean;
}

export const NotifDbSourceName = 'NotifDb';
export const NotifAccessCacheSourceName = 'NotifAccessCache';

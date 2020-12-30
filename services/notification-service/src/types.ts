import {IAuthUserWithPermissions, IServiceConfig} from '@sourceloop/core';
import {Config} from 'loopback4-notifications';
import {Notification, NotificationUser} from './models';

export interface IChannelManager {
  isChannelAccessAllowed(
    user: IAuthUserWithPermissions,
    config: Config,
  ): boolean;
}

export interface INotificationUserManager {
  getNotifUsers(notif: Notification): Promise<NotificationUser[]>;
}

export interface INotifServiceConfig extends IServiceConfig {
  useCustomEmailProvider: boolean;
  useCustomSMSProvider: boolean;
  useCustomPushProvider: boolean;
}

export const NotifDbSourceName = 'NotifDb';
export const NotifAccessCacheSourceName = 'NotifAccessCache';

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions, IServiceConfig} from '@sourceloop/core';
import {Config, Subscriber} from 'loopback4-notifications';
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

export interface INotifServiceConfig extends IServiceConfig {}

export type INotificationFilterFunc = (
  notif: Notification,
) => Promise<Notification>;

export interface INotificationSettingFilterFunc {
  checkUserNotificationSettings(
    notification: Notification,
  ): Promise<Subscriber[]>;
  getNotificationSubscribers(subscribers: Subscriber[]): Promise<Subscriber[]>;
  getDraftSubscribers(subscribers: Subscriber[]): Promise<Subscriber[]>;
}

export const NotifDbSourceName = 'NotifDb';
export const NotifAccessCacheSourceName = 'NotifAccessCache';

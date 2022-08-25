// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

export interface INotifServiceConfig extends IServiceConfig {}

export type INotificationFilterFunc = (
  notif: Notification,
) => Promise<Notification>;

export const NotifDbSourceName = 'NotifDb';
export const NotifAccessCacheSourceName = 'NotifAccessCache';

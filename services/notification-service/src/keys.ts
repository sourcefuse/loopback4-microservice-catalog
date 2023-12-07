﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { BindingKey } from '@loopback/core';
import { BINDING_PREFIX } from '@sourceloop/core';
import {
  IChannelManager,
  INotifServiceConfig,
  INotificationFilterFunc,
  INotificationSettingFilterFunc,
  INotificationUserManager
} from './types';

export namespace NotifServiceBindings {
  export const Config = BindingKey.create<INotifServiceConfig | null>(
    `${BINDING_PREFIX}.notification.config`,
  );
  export const ChannelManager = BindingKey.create<IChannelManager | null>(
    `${BINDING_PREFIX}.notification.channnelMgr`,
  );
  export const NotificationUserManager =
    BindingKey.create<INotificationUserManager | null>(
      `${BINDING_PREFIX}.notification.notifUserMgr`,
    );

  export const NotificationFilter =
    BindingKey.create<INotificationFilterFunc | null>(
      `${BINDING_PREFIX}.notification.notificationFilter`,
    );

  export const NotificationSettingFilter =
    BindingKey.create<INotificationSettingFilterFunc | null>(
      `${BINDING_PREFIX}.notification.notificationSettingFilter`,
    );
}

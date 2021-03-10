import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  IChannelManager,
  INotificationUserManager,
  INotificationUserWhereBuilder,
  INotifServiceConfig,
} from './types';

export namespace NotifServiceBindings {
  export const Config = BindingKey.create<INotifServiceConfig | null>(
    `${BINDING_PREFIX}.notification.config`,
  );
  export const ChannelManager = BindingKey.create<IChannelManager | null>(
    `${BINDING_PREFIX}.notification.channnelMgr`,
  );
  export const NotificationUserManager = BindingKey.create<INotificationUserManager | null>(
    `${BINDING_PREFIX}.notification.notifUserMgr`,
  );
  export const NotificationUserWhereBuilder = BindingKey.create<INotificationUserWhereBuilder | null>(
    `${BINDING_PREFIX}.notification.notifFilterBldr`,
  );
}

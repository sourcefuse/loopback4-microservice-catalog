import {BindingKey} from '@loopback/core';
import {INotifServiceConfig, IChannelManager} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace NotifServiceBindings {
  export const Config = BindingKey.create<INotifServiceConfig | null>(
    `${BINDING_PREFIX}.notification.config`,
  );
  export const ChannelManager = BindingKey.create<IChannelManager | null>(
    `${BINDING_PREFIX}.notification.channnelMgr`,
  );
}

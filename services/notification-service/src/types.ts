import {IAuthUserWithPermissions, IServiceConfig} from '@sourceloop/core';
import {Config} from 'loopback4-notifications';

export interface IChannelManager {
  isChannelAccessAllowed(
    user: IAuthUserWithPermissions,
    config: Config,
  ): boolean;
}

export interface INotifServiceConfig extends IServiceConfig {
  useCustomEmailProvider: boolean;
  useCustomSMSProvider: boolean;
  useCustomPushProvider: boolean;
}

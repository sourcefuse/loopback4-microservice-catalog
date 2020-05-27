import {
  IAuthUserWithPermissions,
  IServiceConfig,
} from '@sourcefuse-service-catalog/core';
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

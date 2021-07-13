import {VideoChatInterface} from './types';
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX, IServiceConfig} from '@sourceloop/core';

/**
 * @namespace VideoChatBindings
 * @const VideoChatProvider Main Parent Provider which binds @interface VideoChatInterface
 */
export namespace VideoChatBindings {
  export const VideoChatProvider = BindingKey.create<VideoChatInterface>(
    'sf.videochatprovider',
  );

  export const Config = BindingKey.create<IServiceConfig | null>(
    `${BINDING_PREFIX}.videochat.config`,
  );
}

export const VideoConfDatasource = 'videochatDb';

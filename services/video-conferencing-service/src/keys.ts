import {VideoChatInterface, IVideoChatServiceConfig} from './types';
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';

/**
 * @namespace VideoChatBindings
 * @const VideoChatProvider Main Parent Provider which binds @interface VideoChatInterface
 */
export namespace VideoChatBindings {
  export const VideoChatProvider = BindingKey.create<VideoChatInterface>(
    'sf.videochatprovider',
  );

  export const Config = BindingKey.create<IVideoChatServiceConfig | null>(
    `${BINDING_PREFIX}.videochat.config`,
  );
}

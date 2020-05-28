import { VideoChatInterface } from './types';
import {BindingKey} from '@loopback/core';
import {IVideoChatServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourcefuse-service-catalog/core';

/**
 * @namespace VideoChatBindings
 * @const VideoChatProvider Main Parent Provider which binds @interface VideoChatInterface
 */
export namespace VideoChatBindings {
  export const VideoChatProvider = BindingKey.create<VideoChatInterface>(
    'sf.videochatprovider',
  );

  export const Config = BindingKey.create<IVideoChatServiceConfig | null>(
    `${BINDING_PREFIX}.notification.config`,
  );
}
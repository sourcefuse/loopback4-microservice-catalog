import {BindingKey} from '@loopback/core';
import {VonageConfig} from './types';

export namespace VonageBindings {
  export const config = BindingKey.create<VonageConfig>(
    'sf.videochatprovider.vonage.config',
  );
}

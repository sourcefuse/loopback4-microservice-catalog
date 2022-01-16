import {BindingKey} from '@loopback/core';
import {IGateway} from './types';
export namespace GatewayBindings {
  export const GatewayHelper = BindingKey.create<IGateway | string | null>(
    'sf.Gateway.helper',
  );
}

import {BindingKey} from '@loopback/core';
export namespace GatewayBindings {
  export const GatewayHelper = BindingKey.create<string | null>(
    'sf.Gateway.helper',
  );
}

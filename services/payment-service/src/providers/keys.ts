import {BindingKey} from '@loopback/core';
export namespace GatewayBindings {
  // eslint-disable-next-line
  export const GatewayHelper = BindingKey.create<any | null>(
    'sf.Gateway.helper',
  );
}

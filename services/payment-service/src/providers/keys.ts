import {BindingKey} from '@loopback/core';
export namespace GatewayBindings {
  // eslint-disable-next-line
  export const GatewayHelper = BindingKey.create<string | null>(
    'sf.Gateway.helper',
  );
}

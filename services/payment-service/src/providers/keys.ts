import {BindingKey} from '@loopback/core';
export namespace GatewayBindings {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  export const GatewayHelper = BindingKey.create<any | null>(
    'sf.Gateway.helper',
  );
}

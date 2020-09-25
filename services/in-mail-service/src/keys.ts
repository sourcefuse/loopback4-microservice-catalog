import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX, IServiceConfig} from '@sourceloop/core';

export namespace InMailBindings {
  export const Config = BindingKey.create<IServiceConfig | null>(
    `${BINDING_PREFIX}.inmail.config`,
  );
}

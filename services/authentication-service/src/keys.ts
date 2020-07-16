import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {IAuthServiceConfig} from './types';

export namespace AuthServiceBindings {
  export const Config = BindingKey.create<IAuthServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
}

import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  IRequestServiceConfig
} from './types';

export namespace RequestServiceBindings {
  export const Config = BindingKey.create<IRequestServiceConfig | null>(
    `${BINDING_PREFIX}.request.config`,
  );
}

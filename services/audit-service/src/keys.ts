import {BindingKey} from '@loopback/core';
import {IAuditServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace AuditServiceBindings {
  export const Config = BindingKey.create<IAuditServiceConfig | null>(
    `${BINDING_PREFIX}.audit.config`,
  );
}

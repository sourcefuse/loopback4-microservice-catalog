// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IAuditServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace AuditServiceBindings {
  export const Config = BindingKey.create<IAuditServiceConfig | null>(
    `${BINDING_PREFIX}.audit.config`,
  );
}

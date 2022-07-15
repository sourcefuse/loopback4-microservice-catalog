// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IChatServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace ChatServiceBindings {
  export const Config = BindingKey.create<IChatServiceConfig | null>(
    `${BINDING_PREFIX}.chat.config`,
  );
}

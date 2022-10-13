// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IToggleServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';
export namespace FeatureToggleBindings {
  export const Config = BindingKey.create<IToggleServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
}

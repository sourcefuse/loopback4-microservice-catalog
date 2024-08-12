// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, Interceptor} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {IToggleServiceConfig} from './types';
export namespace FeatureToggleBindings {
  export const Config = BindingKey.create<IToggleServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
}

export const BOOTSTRAP = BindingKey.create<Interceptor>(
  'feature-bootstrap-callback.verifier',
);

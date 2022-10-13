// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IGateway} from './types';
export namespace GatewayBindings {
  export const GatewayHelper = BindingKey.create<IGateway | string | null>(
    'sf.Gateway.helper',
  );
}

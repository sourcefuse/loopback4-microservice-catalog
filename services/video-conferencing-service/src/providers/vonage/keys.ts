// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {VonageConfig} from './types';

export namespace VonageBindings {
  export const config = BindingKey.create<VonageConfig>(
    'sf.videochatprovider.vonage.config',
  );
}

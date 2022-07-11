// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {TwilioConfig} from './types';

export namespace TwilioBindings {
  export const config = BindingKey.create<TwilioConfig>(
    'sf.videochatprovider.twilio.config',
  );
}

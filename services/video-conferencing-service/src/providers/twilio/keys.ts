import {BindingKey} from '@loopback/core';
import {TwilioConfig} from './types';

export namespace TwilioBindings {
  export const config = BindingKey.create<TwilioConfig>(
    'sf.videochatprovider.twilio.config',
  );
}

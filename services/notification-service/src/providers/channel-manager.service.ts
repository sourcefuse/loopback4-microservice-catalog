// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {IChannelManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class ChannelManagerProvider implements Provider<IChannelManager> {
  value() {
    return {
      isChannelAccessAllowed: () => true,
    };
  }
}

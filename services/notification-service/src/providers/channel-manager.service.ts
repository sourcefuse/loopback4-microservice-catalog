// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {IChannelManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class ChannelManagerProvider implements Provider<IChannelManager> {
  /**
   * The function `value` returns an object with a method `isChannelAccessAllowed` that always returns
   * `true`.
   * @returns The `value()` function is returning an object with a property `isChannelAccessAllowed`
   * which is a function that always returns `true`.
   */
  value() {
    return {
      isChannelAccessAllowed: () => true,
    };
  }
}

import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {IChannelManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class ChannelManagerProvider implements Provider<IChannelManager> {
  constructor() {}

  value() {
    return {
      isChannelAccessAllowed: () => true,
    };
  }
}

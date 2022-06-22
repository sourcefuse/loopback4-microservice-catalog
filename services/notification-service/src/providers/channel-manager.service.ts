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

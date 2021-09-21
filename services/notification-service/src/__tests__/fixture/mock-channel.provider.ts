import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {Config} from 'loopback4-notifications';
import {IChannelManager} from '../../types';

@bind({scope: BindingScope.TRANSIENT})
export class ChannelManagerMockProvider implements Provider<IChannelManager> {
  value() {
    return {
      isChannelAccessAllowed: (
        user: IAuthUserWithPermissions,
        config: Config,
      ) => {
        if (config.receiver.to.map(t => t.id).includes('allowedChannel')) {
          return true;
        } else {
          return false;
        }
      },
    };
  }
}

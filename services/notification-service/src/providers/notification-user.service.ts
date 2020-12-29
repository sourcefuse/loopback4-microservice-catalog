import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {Subscriber} from 'loopback4-notifications';
import {INotificationUserManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationUserProvider
  implements Provider<INotificationUserManager> {
  constructor() {}

  value() {
    return {
      getUserId: (receiver: Subscriber) => receiver.id,
    };
  }
}

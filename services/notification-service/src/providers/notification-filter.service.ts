import {bind, BindingScope, Provider} from '@loopback/core';
import {Notification} from '../models';
import {INotificationFilterFunc} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationFilterProvider
  implements Provider<INotificationFilterFunc>
{
  constructor() {}

  value() {
    return async (notif: Notification) => notif;
  }
}

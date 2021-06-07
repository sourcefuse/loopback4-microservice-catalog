import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {Notification, NotificationUser} from '../models';
import {INotificationUserManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationUserProvider
  implements Provider<INotificationUserManager>
{
  constructor() {}

  value() {
    return {
      getNotifUsers: async (notif: Notification) => {
        return Promise.resolve(
          notif.receiver.to.map(to => {
            const notifUser = new NotificationUser();
            notifUser.notificationId = notif.id ?? '';
            notifUser.userId = to.id;
            return notifUser;
          }),
        );
      },
    };
  }
}

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, Provider} from '@loopback/core';
import {Notification} from '../models';
import {INotificationFilterFunc} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationFilterProvider
  implements Provider<INotificationFilterFunc>
{
  constructor() {
    // do nothing
  }

  value() {
    return async (notif: Notification) => notif;
  }
}

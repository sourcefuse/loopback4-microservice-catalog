import {Provider} from '@loopback/core';
import {WhereBuilder} from '@loopback/repository';
import {INotificationUserWhereBuilder} from '../types';

export class NotificationWhereBuilderProvider
  implements Provider<INotificationUserWhereBuilder> {
  constructor() {}

  value(): INotificationUserWhereBuilder {
    return (currentUser, where?) => {
      const whereBuilder = new WhereBuilder(where);
      whereBuilder.and([
        {
          userId: currentUser.id,
        },
      ]);
      return whereBuilder;
    };
  }
}

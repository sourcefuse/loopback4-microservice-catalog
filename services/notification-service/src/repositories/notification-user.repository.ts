import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {NotificationUser} from '../models';

export class NotificationUserRepository extends DefaultSoftCrudRepository<
  NotificationUser,
  typeof NotificationUser.prototype.id
> {
  constructor(@inject('datasources.NotifDb') dataSource: juggler.DataSource) {
    super(NotificationUser, dataSource);
  }
}

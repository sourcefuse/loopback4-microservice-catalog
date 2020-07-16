import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {NotificationUser} from '../models';
import {NotifDbSourceName} from '../types';

export class NotificationUserRepository extends DefaultSoftCrudRepository<
  NotificationUser,
  typeof NotificationUser.prototype.id
> {
  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(NotificationUser, dataSource);
  }
}

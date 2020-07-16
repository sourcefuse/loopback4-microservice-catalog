import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';

import {Notification} from '../models';
import {NotifDbSourceName} from '../types';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.id
> {
  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Notification, dataSource);
  }
}

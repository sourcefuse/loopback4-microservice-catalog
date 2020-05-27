import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';

import {Notification} from '../models';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.id
> {
  constructor(@inject('datasources.NotifDb') dataSource: juggler.DataSource) {
    super(Notification, dataSource);
  }
}

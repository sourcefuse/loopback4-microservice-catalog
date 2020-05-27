import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {NotificationAccess} from '../models/notification-access.model';

export class NotificationAccessRepository extends DefaultKeyValueRepository<
  NotificationAccess
> {
  constructor(
    @inject('datasources.NotifAccessCache') dataSource: juggler.DataSource,
  ) {
    super(NotificationAccess, dataSource);
  }
}

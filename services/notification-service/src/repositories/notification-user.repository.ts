import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {Notification, NotificationUser} from '../models';
import {NotifDbSourceName} from '../types';
import {NotificationRepository} from './notification.repository';

export class NotificationUserRepository extends DefaultSoftCrudRepository<
  NotificationUser,
  typeof NotificationUser.prototype.id
> {
  public readonly notification: BelongsToAccessor<
    Notification,
    typeof NotificationUser.prototype.id
  >;

  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('NotificationRepository')
    protected notificationRepositoryGetter: Getter<NotificationRepository>,
  ) {
    super(NotificationUser, dataSource);
    this.notification = this.createBelongsToAccessorFor(
      'notification',
      notificationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'notification',
      this.notification.inclusionResolver,
    );
  }
}

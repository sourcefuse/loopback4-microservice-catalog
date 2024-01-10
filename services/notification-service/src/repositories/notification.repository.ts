// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';

import {DefaultTransactionalRepository} from '@loopback/repository/dist';
import {Notification, NotificationUser} from '../models';
import {NotifDbSourceName} from '../types';
import {NotificationUserRepository} from './notification-user.repository';

export class NotificationRepository extends DefaultTransactionalRepository<
  Notification,
  typeof Notification.prototype.id
> {
  public readonly notificationUsers: HasManyRepositoryFactory<
    NotificationUser,
    typeof Notification.prototype.id
  >;

  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('NotificationUserRepository')
    protected notificationUserRepositoryGetter: Getter<NotificationUserRepository>,
  ) {
    super(Notification, dataSource);
    this.notificationUsers = this.createHasManyRepositoryFactoryFor(
      'notificationUsers',
      notificationUserRepositoryGetter,
    );
    this.registerInclusionResolver(
      'notificationUsers',
      this.notificationUsers.inclusionResolver,
    );
  }
}

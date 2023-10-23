// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';

import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {Notification, NotificationUser} from '../../models';
import {NotifDbSourceName} from '../../types';
import {NotificationRepository} from './notification.repository';
export class NotificationUserRepository extends SequelizeSoftCrudRepository<
  NotificationUser,
  typeof NotificationUser.prototype.id
> {
  public readonly notification: BelongsToAccessor<
    Notification,
    typeof NotificationUser.prototype.id
  >;

  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: SequelizeDataSource,
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

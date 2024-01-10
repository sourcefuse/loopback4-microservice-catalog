// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {UserNotificationSettings} from '../../models';
import {NotifDbSourceName} from '../../types';

export class UserNotificationSettingsRepository extends SequelizeSoftCrudRepository<
  UserNotificationSettings,
  typeof UserNotificationSettings.prototype.id
> {
  constructor(
    @inject(`datasources.${NotifDbSourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(UserNotificationSettings, dataSource);
  }
}

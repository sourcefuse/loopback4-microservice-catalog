// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {UserNotificationSettings} from '../models';
import {NotifDbSourceName} from '../types';

export class UserNotificationSettingsRepository extends DefaultSoftCrudRepository<
  UserNotificationSettings,
  typeof UserNotificationSettings.prototype.id
> {
  constructor(
    @inject(`datasources.${NotifDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(UserNotificationSettings, dataSource);
  }
}

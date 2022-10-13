// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {NotificationAccess} from '../models/notification-access.model';
import {NotifAccessCacheSourceName} from '../types';

export class NotificationAccessRepository extends DefaultKeyValueRepository<NotificationAccess> {
  constructor(
    @inject(`datasources.${NotifAccessCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(NotificationAccess, dataSource);
  }
}

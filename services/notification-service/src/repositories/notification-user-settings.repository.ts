// // Copyright (c) 2023 Sourcefuse Technologies
// //
// // This software is released under the MIT License.
// // https://opensource.org/licenses/MIT
// import { Getter, inject } from '@loopback/core';
// import { BelongsToAccessor, juggler, repository } from '@loopback/repository';
// import { DefaultSoftCrudRepository } from '@sourceloop/core';

// import { Notification, UserNotificationSettings } from '../models';
// import { NotifDbSourceName } from '../types';
// import { NotificationRepository } from './notification.repository';

// export class UserNotificationSettingsRepository extends DefaultSoftCrudRepository<
//   UserNotificationSettings,
//   typeof UserNotificationSettings.prototype.id
// > {
//   public readonly notification: BelongsToAccessor<
//     Notification,
//     typeof UserNotificationSettings.prototype.id
//   >;

//   constructor(
//     @inject(`datasources.${NotifDbSourceName}`)
//     dataSource: juggler.DataSource,
//     @repository.getter('NotificationRepository')
//     protected notificationRepositoryGetter: Getter<NotificationRepository>,
//   ) {
//     super(UserNotificationSettings, dataSource);
//     this.notification = this.createBelongsToAccessorFor(
//       'notification',
//       notificationRepositoryGetter,
//     );
//     this.registerInclusionResolver(
//       'notification',
//       this.notification.inclusionResolver,
//     );
//   }
// }

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';

import { UserNotificationSettings } from '../models';
import { NotifDbSourceName } from '../types';

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

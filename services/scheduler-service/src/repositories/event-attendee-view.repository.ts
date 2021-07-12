import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {EventAttendeeView} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {juggler} from '@loopback/repository';
import {SchedulerDatasourceName} from '../keys';

export class EventAttendeeViewRepository extends DefaultUserModifyCrudRepository<
  EventAttendeeView,
  typeof EventAttendeeView.prototype.id,
  EventAttendeeView
> {
  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(EventAttendeeView, dataSource, getCurrentUser);
  }
}

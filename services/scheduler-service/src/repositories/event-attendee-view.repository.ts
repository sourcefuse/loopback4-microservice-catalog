// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {juggler, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {SchedulerDatasourceName} from '../keys';
import {EventAttendeeView} from '../models';
import {AuditLogRepository} from './audit.repository';

const EventAttendeeViewAuditOpts: IAuditMixinOptions = {
  actionKey: 'Event_Attendee_View_Logs',
};
export class EventAttendeeViewRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    EventAttendeeView,
    typeof EventAttendeeView.prototype.id,
    EventAttendeeView
  >,
  EventAttendeeViewAuditOpts,
) {
  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(EventAttendeeView, dataSource, getCurrentUser);
  }
}

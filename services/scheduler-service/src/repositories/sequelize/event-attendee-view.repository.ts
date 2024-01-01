// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SchedulerDatasourceName} from '../../keys';
import {EventAttendeeView} from '../../models';
import {AuditLogRepository} from './audit.repository';
const EventAttendeeViewAuditOpts: IAuditMixinOptions = {
  actionKey: 'Event_Attendee_View_Logs',
};
export class EventAttendeeViewRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    EventAttendeeView,
    typeof EventAttendeeView.prototype.id,
    EventAttendeeView
  >,
  EventAttendeeViewAuditOpts,
) {
  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: SequelizeDataSource,
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

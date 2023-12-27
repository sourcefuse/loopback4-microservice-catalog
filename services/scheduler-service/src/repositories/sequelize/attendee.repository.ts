// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';

import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../../keys';
import {Attendee, AttendeeRelations, Event} from '../../models';
import {AuditLogRepository} from './audit.repository';
import {EventRepository} from './event.repository';

const AttendeeAuditOpts: IAuditMixinOptions = {
  actionKey: 'Attendee_Logs',
};
export class AttendeeRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    Attendee,
    typeof Attendee.prototype.id,
    AttendeeRelations
  >,
  AttendeeAuditOpts,
) {
  public readonly event: BelongsToAccessor<Event, typeof Attendee.prototype.id>;

  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('EventRepository')
    protected eventRepositoryGetter: Getter<EventRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Attendee, dataSource, getCurrentUser);
    this.event = this.createBelongsToAccessorFor(
      'event',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('event', this.event.inclusionResolver);
  }
}

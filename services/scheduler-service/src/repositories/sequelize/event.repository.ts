﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../../keys';
import {
  Attachment,
  Attendee,
  Calendar,
  Event,
  EventRelations,
} from '../../models';
import {AttachmentRepository} from './attachment.repository';
import {AttendeeRepository} from './attendee.repository';
import {AuditLogRepository} from './audit.repository';
import {CalendarRepository} from './calendar.repository';
const EventAuditOpts: IAuditMixinOptions = {
  actionKey: 'Event_Logs',
};
export class EventRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    Event,
    typeof Event.prototype.id,
    EventRelations
  >,
  EventAuditOpts,
) {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof Event.prototype.id
  >;

  public readonly parentEvent: BelongsToAccessor<
    Event,
    typeof Event.prototype.id
  >;

  public readonly attendees: HasManyRepositoryFactory<
    Attendee,
    typeof Event.prototype.id
  >;

  public readonly attachments: HasManyRepositoryFactory<
    Attachment,
    typeof Event.prototype.id
  >;

  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('CalendarRepository')
    protected calendarRepositoryGetter: Getter<CalendarRepository>,
    @repository.getter('AttendeeRepository')
    protected attendeeRepositoryGetter: Getter<AttendeeRepository>,
    @repository.getter('AttachmentRepository')
    protected attachmentRepositoryGetter: Getter<AttachmentRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Event, dataSource, getCurrentUser);

    this.attachments = this.createHasManyRepositoryFactoryFor(
      'attachments',
      attachmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'attachments',
      this.attachments.inclusionResolver,
    );

    this.attendees = this.createHasManyRepositoryFactoryFor(
      'attendees',
      attendeeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'attendees',
      this.attendees.inclusionResolver,
    );

    this.parentEvent = this.createBelongsToAccessorFor(
      'parentEvent',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'parentEvent',
      this.parentEvent.inclusionResolver,
    );

    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );

    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}

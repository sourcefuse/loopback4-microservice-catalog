import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../keys';
import {Attachment, Attendee, Calendar, Event, EventRelations} from '../models';
import {AttachmentRepository} from './attachment.repository';
import {AttendeeRepository} from './attendee.repository';
import {CalendarRepository} from './calendar.repository';

export class EventRepository extends DefaultUserModifyCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
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
    dataSource: juggler.DataSource,
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

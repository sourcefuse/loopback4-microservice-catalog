import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {SchedulerBindings} from '../keys';
import {Attendee, AttendeeRelations, Event} from '../models';
import {EventRepository} from './event.repository';

export class AttendeeRepository extends DefaultCrudRepository<
  Attendee,
  typeof Attendee.prototype.id,
  AttendeeRelations
> {
  public readonly event: BelongsToAccessor<Event, typeof Attendee.prototype.id>;

  constructor(
    @inject(SchedulerBindings.dbConnector) dataSource: juggler.DataSource,
    @repository.getter('EventRepository')
    protected eventRepositoryGetter: Getter<EventRepository>,
  ) {
    super(Attendee, dataSource);
    this.event = this.createBelongsToAccessorFor(
      'event',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('event', this.event.inclusionResolver);
  }
}

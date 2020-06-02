import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {SchedulerBindings} from '../keys';
import {Calendar, WorkingHour, WorkingHourRelations} from '../models';
import {CalendarRepository} from './calendar.repository';

export class WorkingHourRepository extends DefaultCrudRepository<
  WorkingHour,
  typeof WorkingHour.prototype.id,
  WorkingHourRelations
> {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof WorkingHour.prototype.id
  >;

  constructor(
    @inject(SchedulerBindings.dbConnector) dataSource: juggler.DataSource,
    @repository.getter('CalendarRepository')
    protected calendarRepositoryGetter: Getter<CalendarRepository>,
  ) {
    super(WorkingHour, dataSource);

    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );

    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}

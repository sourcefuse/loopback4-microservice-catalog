import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {Calendar, Subscription, SubscriptionRelations} from '../models';
import {CalendarRepository} from './calendar.repository';

export class SubscriptionRepository extends DefaultCrudRepository<
  Subscription,
  typeof Subscription.prototype.id,
  SubscriptionRelations
> {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof Subscription.prototype.id
  >;

  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
    @repository.getter('CalendarRepository')
    protected calendarRepositoryGetter: Getter<CalendarRepository>,
  ) {
    super(Subscription, dataSource);
    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );
    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}

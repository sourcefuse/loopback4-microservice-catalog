import {Getter, inject} from '@loopback/core';
import {
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
import {
  Calendar,
  CalendarRelations,
  Event,
  Subscription,
  WorkingHour,
} from '../models';
import {EventRepository} from './event.repository';
import {SubscriptionRepository} from './subscription.repository';
import {WorkingHourRepository} from './working-hour.repository';

export class CalendarRepository extends DefaultUserModifyCrudRepository<
  Calendar,
  typeof Calendar.prototype.id,
  CalendarRelations
> {
  public readonly events: HasManyRepositoryFactory<
    Event,
    typeof Calendar.prototype.id
  >;

  public readonly workingHours: HasManyRepositoryFactory<
    WorkingHour,
    typeof Calendar.prototype.id
  >;

  public readonly subscriptions: HasManyRepositoryFactory<
    Subscription,
    typeof Calendar.prototype.id
  >;

  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('EventRepository')
    protected eventRepositoryGetter: Getter<EventRepository>,
    @repository.getter('WorkingHourRepository')
    protected workingHourRepositoryGetter: Getter<WorkingHourRepository>,
    @repository.getter('SubscriptionRepository')
    protected SubscriptionRepositoryGetter: Getter<SubscriptionRepository> /* eslint-disable-line @typescript-eslint/naming-convention */,
  ) {
    super(Calendar, dataSource, getCurrentUser);
    this.subscriptions = this.createHasManyRepositoryFactoryFor(
      'subscriptions',
      SubscriptionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'subscriptions',
      this.subscriptions.inclusionResolver,
    );
    this.workingHours = this.createHasManyRepositoryFactoryFor(
      'workingHours',
      workingHourRepositoryGetter,
    );
    this.registerInclusionResolver(
      'workingHours',
      this.workingHours.inclusionResolver,
    );
    this.events = this.createHasManyRepositoryFactoryFor(
      'events',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('events', this.events.inclusionResolver);
  }
}

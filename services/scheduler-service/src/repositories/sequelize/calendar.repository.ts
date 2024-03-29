﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
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
  Calendar,
  CalendarRelations,
  Event,
  Subscription,
  WorkingHour,
} from '../../models';
import {AuditLogRepository} from './audit.repository';
import {EventRepository} from './event.repository';
import {SubscriptionRepository} from './subscription.repository';
import {WorkingHourRepository} from './working-hour.repository';

const CalenderAuditOpts: IAuditMixinOptions = {
  actionKey: 'Calender_Logs',
};

export class CalendarRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    Calendar,
    typeof Calendar.prototype.id,
    CalendarRelations
  >,
  CalenderAuditOpts,
) {
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
    dataSource: SequelizeDataSource,
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
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
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

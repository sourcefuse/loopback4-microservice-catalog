// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../keys';
import {Calendar, Subscription, SubscriptionRelations} from '../models';
import {AuditLogRepository} from './audit.repository';
import {CalendarRepository} from './calendar.repository';

const SubscriptionAuditOpts: IAuditMixinOptions = {
  actionKey: 'Subscription_Logs',
};
export class SubscriptionRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    Subscription,
    typeof Subscription.prototype.id,
    SubscriptionRelations
  >,
  SubscriptionAuditOpts,
) {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof Subscription.prototype.id
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
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Subscription, dataSource, getCurrentUser);
    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );
    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}

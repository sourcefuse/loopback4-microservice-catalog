// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../../keys';
import {Calendar, WorkingHour, WorkingHourRelations} from '../../models';
import {AuditLogRepository} from './audit.repository';
import {CalendarRepository} from './calendar.repository';
const WorkingHourAuditOpts: IAuditMixinOptions = {
  actionKey: 'Working_Hours_Logs',
};

export class WorkingHourRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    WorkingHour,
    typeof WorkingHour.prototype.id,
    WorkingHourRelations
  >,
  WorkingHourAuditOpts,
) {
  public readonly calendar: BelongsToAccessor<
    Calendar,
    typeof WorkingHour.prototype.id
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
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(WorkingHour, dataSource, getCurrentUser);

    this.calendar = this.createBelongsToAccessorFor(
      'calendar',
      calendarRepositoryGetter,
    );

    this.registerInclusionResolver('calendar', this.calendar.inclusionResolver);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../../keys';
import {Theme} from '../../models';
import {AuditLogRepository} from './audit.repository';

const ThemeAuditOpts: IAuditMixinOptions = {
  actionKey: 'Theme_Logs',
};
export class ThemeRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<Theme, typeof Theme.prototype.id, {}>,
  ThemeAuditOpts,
) {
  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Theme, dataSource, getCurrentUser);
  }
}

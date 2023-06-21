// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {juggler, repository} from '@loopback/repository';
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
import {Settings} from '../models';
import {AuditLogRepository} from './audit.repository';

const SettingsAuditOpts: IAuditMixinOptions = {
  actionKey: 'Settings_Logs',
};
export class SettingsRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<Settings, typeof Settings.prototype.id, {}>,
  SettingsAuditOpts,
) {
  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Settings, dataSource, getCurrentUser);
  }
}

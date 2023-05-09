// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, juggler, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {UserTenantDataSourceName} from '../keys';
import {AuthClient} from '../models';
import {AuditLogRepository} from './audit.repository';

const AuthClientAuditOpts: IAuditMixinOptions = {
  actionKey: 'Auth_Client_Logs',
};

export class AuthClientRepository extends ConditionalAuditRepositoryMixin(
  DefaultCrudRepository<AuthClient, typeof AuthClient.prototype.id>,
  AuthClientAuditOpts,
) {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(AuthClient, dataSource);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';

import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {UserTenantDataSourceName} from '../keys';
import {User, UserCredentials, UserCredentialsRelations} from '../models';
import {AuditLogRepository} from './audit.repository';
import {UserRepository} from './user.repository';

const UserCredentialsAuditOpts: IAuditMixinOptions = {
  actionKey: 'User_Credentials_Logs',
};

export class UserCredentialsRepository extends ConditionalAuditRepositoryMixin(
  SoftCrudRepository<
    UserCredentials,
    typeof UserCredentials.prototype.id,
    UserCredentialsRelations
  >,
  UserCredentialsAuditOpts,
) {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserCredentials.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(UserCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}

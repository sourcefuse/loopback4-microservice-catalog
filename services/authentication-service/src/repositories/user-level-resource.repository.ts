import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository, juggler} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {UserLevelResource, UserTenant} from '../models';

import {UserTenantRepository} from './user-tenant.repository';
import {AuthDbSourceName} from '../types';

export class UserLevelResourceRepository extends DefaultUserModifyCrudRepository<
  UserLevelResource,
  typeof UserLevelResource.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelResource.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserLevelResource, dataSource, getCurrentUser);
    this.userTenant = this.createBelongsToAccessorFor(
      'userTenant',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenant',
      this.userTenant.inclusionResolver,
    );
  }
}

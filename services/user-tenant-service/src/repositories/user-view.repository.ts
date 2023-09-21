import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserView} from '../models';
import { UserTenantDataSourceName } from '../keys';
import { IAuthUserWithPermissions, tenantGuard } from '@sourceloop/core';
import { AuthenticationBindings } from 'loopback4-authentication';

@tenantGuard()
export class UserViewRepository extends DefaultCrudRepository<
  UserView,
  typeof UserView.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(UserView, dataSource);
  }
}

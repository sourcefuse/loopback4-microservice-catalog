import { inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserView} from '../models';
import { UserTenantDataSourceName } from '../keys';
import {  tenantGuard } from '@sourceloop/core';

@tenantGuard()
export class UserViewRepository extends DefaultCrudRepository<
  UserView,
  typeof UserView.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(UserView, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuthClient} from '../models';
import { UserTenantDataSourceName } from '../keys';

export class AuthClientRepository extends DefaultCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource, 
  ) {
    super(AuthClient, dataSource);
  }
}

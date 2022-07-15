// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuthClient} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {inject} from '@loopback/core';

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

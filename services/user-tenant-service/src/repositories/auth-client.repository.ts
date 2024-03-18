// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {UserTenantDataSourceName} from '../keys';
import {AuthClient} from '../models';

export class AuthClientRepository extends DefaultCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject('models.AuthClient')
    private readonly authClient: typeof Entity & {prototype: AuthClient},
  ) {
    super(authClient, dataSource);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {UserTenantDataSourceName} from '../../keys';
import {AuthClient} from '../../models';

export class AuthClientRepository extends SequelizeCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.AuthClient')
    private readonly authClient: typeof Entity & {prototype: AuthClient},
  ) {
    super(authClient, dataSource);
  }
}

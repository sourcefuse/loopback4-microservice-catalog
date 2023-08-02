// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {AuthDbSourceName, Role} from '@sourceloop/authentication-service';

export class RoleRepository extends DefaultSoftCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Role, dataSource);
  }
}

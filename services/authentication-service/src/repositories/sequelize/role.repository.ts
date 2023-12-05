// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';

import {Entity} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {Role} from '../../models';
import {AuthDbSourceName} from '../../types';

export class RoleRepository extends SequelizeUserModifyCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @inject('models.Role')
    private readonly role: typeof Entity & {prototype: Role},
  ) {
    super(role, dataSource, getCurrentUser);
  }
}

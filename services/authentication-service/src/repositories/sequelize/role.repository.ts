// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';

import {Entity} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {Role} from '../../models';
import {AuthDbSourceName} from '../../types';

export class RoleRepository extends SequelizeSoftCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.Role')
    private readonly role: typeof Entity & {prototype: Role},
  ) {
    super(role, dataSource);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';

import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {Role} from '../models';
import {AuthDbSourceName} from '../types';

export class RoleRepository extends DefaultSoftCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject('models.Role')
    private readonly role: typeof Entity & {prototype: Role},
  ) {
    super(role, dataSource);
  }
}

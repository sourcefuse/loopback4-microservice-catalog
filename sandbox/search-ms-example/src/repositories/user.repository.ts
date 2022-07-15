// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DynamicDataSource} from '../datasources';
import {User} from '../models';
import {SearchServiceBindings} from '@sourceloop/search-service';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: DynamicDataSource,
  ) {
    super(User, dataSource);
  }
}

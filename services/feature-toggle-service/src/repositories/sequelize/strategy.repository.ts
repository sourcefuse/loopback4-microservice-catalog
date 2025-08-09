// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Strategy} from '../../models';
import {FeatureToggleDbName} from '../../types';

export class StrategyRepository extends SequelizeSoftCrudRepository<
  Strategy,
  typeof Strategy.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Strategy, dataSource, getCurrentUser);
  }
}

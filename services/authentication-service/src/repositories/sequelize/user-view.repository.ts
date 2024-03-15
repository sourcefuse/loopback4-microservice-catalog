// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {HasOneRepositoryFactory} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {UserCredentials} from '../../models/user-credentials.model';
import {UserView} from '../../models/user-view.model';
import {User} from '../../models/user.model';
import {AuthDbSourceName} from '../../types';

export class UserViewRepository extends SequelizeSoftCrudRepository<
  UserView,
  typeof UserView.prototype.id
> {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(UserView, dataSource, getCurrentUser);
  }
}

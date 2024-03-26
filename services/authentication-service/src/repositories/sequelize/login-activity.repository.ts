import {Getter, inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {UserInToken} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {LoginActivity} from '../../models';
import {AuthDbSourceName} from '../../types';

export class LoginActivityRepository extends SequelizeCrudRepository<
  LoginActivity,
  typeof LoginActivity.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<UserInToken>,
  ) {
    super(LoginActivity, dataSource);
  }
}

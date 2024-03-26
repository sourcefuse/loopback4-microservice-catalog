import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserInToken} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {LoginActivity} from '../models/login-activity.model';
import {AuthDbSourceName} from '../types';

export class LoginActivityRepository extends DefaultCrudRepository<
  LoginActivity,
  typeof LoginActivity.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<UserInToken>,
  ) {
    super(LoginActivity, dataSource);
  }
}

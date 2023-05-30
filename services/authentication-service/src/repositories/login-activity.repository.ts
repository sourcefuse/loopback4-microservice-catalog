import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuthDbSourceName} from '../types';
import {LoginActivity} from '../models';
import {inject} from '@loopback/core';

export class LoginActivityRepository extends DefaultCrudRepository<
  LoginActivity,
  typeof LoginActivity.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(LoginActivity, dataSource);
  }
}

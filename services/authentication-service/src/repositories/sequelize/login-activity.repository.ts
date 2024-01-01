import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {LoginActivity} from '../../models';
import {AuthDbSourceName} from '../../types';

export class LoginActivityRepository extends SequelizeCrudRepository<
  LoginActivity,
  typeof LoginActivity.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(LoginActivity, dataSource);
  }
}

// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {AuthClient} from '../../models';
import {AuthDbSourceName} from '../../types';
export class AuthClientRepository extends SequelizeSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(AuthClient, dataSource);
  }
}

import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {JwtKeys} from '../../models';
import {AuthDbSourceName} from '../../types';

export class JwtKeysRepository extends SequelizeCrudRepository<
  JwtKeys,
  typeof JwtKeys.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(JwtKeys, dataSource);
  }
}

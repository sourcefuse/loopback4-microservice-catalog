import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuthDbSourceName} from '../../../types';
import {JwtKeys} from '../models';
export class JwtKeysRepository extends DefaultCrudRepository<
  JwtKeys,
  typeof JwtKeys.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(JwtKeys, dataSource);
  }
}

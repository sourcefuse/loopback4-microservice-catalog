import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {JwtKeys} from '../models';
import {AuthDbSourceName} from '../types';

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

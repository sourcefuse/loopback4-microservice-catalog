import {DefaultCrudRepository} from '@loopback/repository';
import {AuthClient} from '../models';
import {PgdbDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {AuthDbSourceName} from '@sourceloop/authentication-service';

export class AuthClientExtRepository extends DefaultCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
  ) {
    super(AuthClient, dataSource);
  }
}

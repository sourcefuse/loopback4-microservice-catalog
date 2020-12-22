import {Getter, inject} from '@loopback/core';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {PgdbDataSource} from '../datasources';
import {UserLevelResource} from '../models';

export class UserLevelResourceRepository extends DefaultUserModifyCrudRepository<
  UserLevelResource,
  typeof UserLevelResource.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(UserLevelResource, dataSource, getCurrentUser);
  }
}

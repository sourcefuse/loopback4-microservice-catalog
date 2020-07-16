import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {Role} from '../models';
import {AuthDbSourceName} from '../types';

export class RoleRepository extends DefaultUserModifyCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Role, dataSource, getCurrentUser);
  }
}

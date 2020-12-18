import {Getter} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {IAuthUserWithPermissions} from '../components';
import {DefaultUserModifyCrudRepository} from './default-user-modify-crud.repository.base';

import {UserLevelResource} from '../models';

export class UserLevelResourceRepository extends DefaultUserModifyCrudRepository<
  UserLevelResource,
  typeof UserLevelResource.prototype.id
> {
  constructor(
    dataSource: juggler.DataSource,
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(UserLevelResource, dataSource, getCurrentUser);
  }
}

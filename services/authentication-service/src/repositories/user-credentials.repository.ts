import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository, juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {User, UserCredentials, UserCredentialsRelations} from '../models';
import {UserRepository} from './user.repository';
import {AuthDbSourceName} from '../types';

export class UserCredentialsRepository extends DefaultSoftCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserCredentials.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

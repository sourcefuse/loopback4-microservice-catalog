import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {PgdbDataSource} from '../datasources';
import {User, UserCredentials, UserCredentialsRelations} from '../models';
import {UserExtRepository} from './user-ext.repository';

export class UserCredentialsExtRepository extends DefaultSoftCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserCredentials.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserExtRepository>,
  ) {
    super(UserCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}

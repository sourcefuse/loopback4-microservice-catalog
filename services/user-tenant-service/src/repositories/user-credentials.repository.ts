import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, juggler, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserCredentials, UserCredentialsRelations, User} from '../models';
import { UserTenantDataSourceName } from '../keys';
import {UserRepository} from './user.repository';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserCredentials.prototype.id>;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

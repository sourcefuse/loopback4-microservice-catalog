import {BelongsToAccessor, juggler} from '@loopback/repository';
import {Group, Message, Thread} from '../models';
import {inject, Getter} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {InMailDatasourceName} from '../keys';

export class GroupRepository extends DefaultUserModifyCrudRepository<
  Group,
  typeof Group.prototype.id
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof Group.prototype.id
  >;

  public readonly thread: BelongsToAccessor<Thread, typeof Group.prototype.id>;

  constructor(
    @inject(`datasources.${InMailDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Group, dataSource, getCurrentUser);
  }
}

import {BelongsToAccessor, juggler} from '@loopback/repository';
import {Meta, Message} from '../models';
import {inject, Getter} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {InMailDatasourceName} from '../keys';

export class MetaRepository extends DefaultUserModifyCrudRepository<
  Meta,
  typeof Meta.prototype.id
> {
  public readonly message: BelongsToAccessor<Message, typeof Meta.prototype.id>;

  constructor(
    @inject(`datasources.${InMailDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Meta, dataSource, getCurrentUser);
  }
}

import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {ThreadView} from '../models';

export class ThreadViewRepository extends DefaultUserModifyCrudRepository<
  ThreadView,
  typeof ThreadView.prototype.id
> {
  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(ThreadView, dataSource, getCurrentUser);
  }
}

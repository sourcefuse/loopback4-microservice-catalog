import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Theme} from '../models';

export class ThemeRepository extends DefaultUserModifyCrudRepository<
  Theme,
  typeof Theme.prototype.id
> {
  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Theme, dataSource, getCurrentUser);
  }
}

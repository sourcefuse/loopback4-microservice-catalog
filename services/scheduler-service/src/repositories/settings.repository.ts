import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourcefuse-service-catalog/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Settings} from '../models';

export class SettingsRepository extends DefaultUserModifyCrudRepository<
  Settings,
  typeof Settings.prototype.id
> {
  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Settings, dataSource, getCurrentUser);
  }
}

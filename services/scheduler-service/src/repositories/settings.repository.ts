import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Settings, SettingsRelations} from '../models';

export class SettingsRepository extends DefaultCrudRepository<
  Settings,
  typeof Settings.prototype.id,
  SettingsRelations
> {
  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
  ) {
    super(Settings, dataSource);
  }
}

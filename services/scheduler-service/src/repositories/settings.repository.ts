import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {SchedulerBindings} from '../keys';
import {Settings, SettingsRelations} from '../models';

export class SettingsRepository extends DefaultCrudRepository<
  Settings,
  typeof Settings.prototype.id,
  SettingsRelations
> {
  constructor(
    @inject(SchedulerBindings.dbConnector) dataSource: juggler.DataSource,
  ) {
    super(Settings, dataSource);
  }
}

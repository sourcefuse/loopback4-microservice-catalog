import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Projects} from '../models';
import {FeatureToggleDbName} from '../types';

export class ProjectsRepository extends DefaultCrudRepository<
  Projects,
  typeof Projects.prototype.id
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Projects, dataSource);
  }
}

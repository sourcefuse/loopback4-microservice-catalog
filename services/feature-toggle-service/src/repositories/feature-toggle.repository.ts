import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {FeatureToggle} from '../models';
import {FeatureToggleDbName} from '../types';

export class FeatureToggleRepository extends DefaultCrudRepository<
  FeatureToggle,
  typeof FeatureToggle.prototype.id
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(FeatureToggle, dataSource);
  }
}

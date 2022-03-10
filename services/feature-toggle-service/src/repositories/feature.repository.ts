import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Feature} from '../models';
import {FeatureToggleDbName} from '../types';

export class FeatureRepository extends DefaultCrudRepository<
  Feature,
  typeof Feature.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Feature, dataSource);
  }
}

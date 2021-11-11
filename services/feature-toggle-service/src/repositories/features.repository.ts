import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Features} from '../models';
import {FeatureToggleDbName} from '../types';

export class FeaturesRepository extends DefaultCrudRepository<
  Features,
  typeof Features.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Features, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Strategies} from '../models';
import {FeatureToggleDbName} from '../types';

export class StrategiesRepository extends DefaultCrudRepository<
  Strategies,
  typeof Strategies.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Strategies, dataSource);
  }
}

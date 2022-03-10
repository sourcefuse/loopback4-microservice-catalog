import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Strategy} from '../models';
import {FeatureToggleDbName} from '../types';

export class StrategyRepository extends DefaultCrudRepository<
  Strategy,
  typeof Strategy.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Strategy, dataSource);
  }
}

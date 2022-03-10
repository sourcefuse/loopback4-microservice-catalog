import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {ToggleStatus} from '../models';

import {FeatureToggleCacheDb} from '../types';

export class ToggleStatusRepository extends DefaultKeyValueRepository<ToggleStatus> {
  constructor(
    @inject(`datasources.${FeatureToggleCacheDb}`)
    dataSource: juggler.DataSource,
  ) {
    super(ToggleStatus, dataSource);
  }
}

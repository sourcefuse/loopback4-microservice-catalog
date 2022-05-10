import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {OtpCache} from '../models';
import {AuthCacheSourceName} from '../types';

export class OtpCacheRepository extends DefaultKeyValueRepository<OtpCache> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(OtpCache, dataSource);
  }
}

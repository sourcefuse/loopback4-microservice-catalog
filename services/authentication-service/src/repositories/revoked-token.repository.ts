import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {RevokedToken} from '../models';
import {AuthCacheSourceName} from '../types';

export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(RevokedToken, dataSource);
  }
}

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {RevokedToken} from '../models';
import {AuthCacheSourceName} from '../types';

/** 
 *  It's a repository that extends the `DefaultKeyValueRepository` class, which is a class that comes with
    LoopBack 4. 
 *  It's a repository that uses the AuthCacheSource data source to store and retrieve data */
export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(RevokedToken, dataSource);
  }
}

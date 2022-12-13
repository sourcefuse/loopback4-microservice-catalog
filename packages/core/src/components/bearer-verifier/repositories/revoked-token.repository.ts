﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {RevokedToken} from '../models';
import {AuthCacheSourceName} from '../types';

/**
 * A repository class using the AuthCacheSource to store RevokedToken.
 */
export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(RevokedToken, dataSource);
  }
}

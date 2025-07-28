// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {JwtKeys} from '../models';
import {AuthCacheSourceName} from '../types';

export class PublicKeysRepository extends DefaultKeyValueRepository<JwtKeys> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(JwtKeys, dataSource);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbDataSource} from '../datasources';
import {TenantConfig, TenantConfigRelations} from '../models';
export class TenantConfigRepository extends DefaultCrudRepository<
  TenantConfig,
  typeof TenantConfig.prototype.id,
  TenantConfigRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: AuthDbDataSource) {
    super(TenantConfig, dataSource);
  }
}

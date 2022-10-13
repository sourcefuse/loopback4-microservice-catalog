// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingDatasourceName} from '../keys';
import {MetabaseToken} from '../models';

export class MetabaseTokenRepository extends DefaultCrudRepository<
  MetabaseToken,
  typeof MetabaseToken.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${ReportingDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(MetabaseToken, dataSource);
  }
}

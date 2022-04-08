import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingDatasourceName} from '../keys';
import {MetabaseToken, MetabaseTokenRelations} from '../models';

export class MetabaseTokenRepository extends DefaultCrudRepository<
  MetabaseToken,
  typeof MetabaseToken.prototype.id,
  MetabaseTokenRelations
> {
  constructor(
    @inject(`datasources.${ReportingDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(MetabaseToken, dataSource);
  }
}

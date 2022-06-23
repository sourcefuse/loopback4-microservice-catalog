import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingDatasourceName} from '../keys';
import {Queries} from '../models';

export class QueriesRepository extends DefaultCrudRepository<
  Queries,
  typeof Queries.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${ReportingDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Queries, dataSource);
  }
}

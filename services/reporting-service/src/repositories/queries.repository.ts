import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingDatasourceName} from '../keys';
import {Queries, QueriesRelations} from '../models';

export class QueriesRepository extends DefaultCrudRepository<
  Queries,
  typeof Queries.prototype.id,
  QueriesRelations
> {
  constructor(
    @inject(`datasources.${ReportingDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Queries, dataSource);
  }
}

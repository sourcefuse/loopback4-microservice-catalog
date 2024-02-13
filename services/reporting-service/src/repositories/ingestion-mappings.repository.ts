import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingServiceComponentBindings} from '../keys';
import {IngestionMapping} from '../models';
export class IngestionMappingsRepository extends DefaultCrudRepository<
  IngestionMapping,
  typeof IngestionMapping.prototype.dataSourceName
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(IngestionMapping, dataSource);
  }
}

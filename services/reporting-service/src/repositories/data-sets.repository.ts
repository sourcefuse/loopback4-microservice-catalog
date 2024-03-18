import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingServiceComponentBindings} from '../keys';
import {DataSet} from '../models';

export class DataSetsRepository extends DefaultCrudRepository<
  DataSet,
  typeof DataSet.prototype.id
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(DataSet, dataSource);
  }
}

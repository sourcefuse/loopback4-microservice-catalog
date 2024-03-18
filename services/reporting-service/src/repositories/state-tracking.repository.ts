import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingServiceComponentBindings} from '../keys';
import {StateTracking} from '../models';

export class StateTrackingRepository extends DefaultCrudRepository<
  StateTracking,
  typeof StateTracking.prototype.id
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(StateTracking, dataSource);
  }
}

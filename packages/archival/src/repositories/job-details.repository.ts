import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';

import {JobDetails} from '../models';
import {ArchivalDbSourceName} from '../types';

export class JobDetailsRepository extends DefaultCrudRepository<
  JobDetails,
  typeof JobDetails.prototype.id
> {
  constructor(
    @inject(`datasources.${ArchivalDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(JobDetails, dataSource);
  }
}

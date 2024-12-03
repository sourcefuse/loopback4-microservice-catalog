import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';

import {RetrievalJobDetails} from '../models';
import {ArchivalDbSourceName} from '../types';

export class RetrievalJobDetailsRepository extends DefaultCrudRepository<
  RetrievalJobDetails,
  typeof RetrievalJobDetails.prototype.id
> {
  constructor(
    @inject(`datasources.${ArchivalDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(RetrievalJobDetails, dataSource);
  }
}

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {EventWorkflowMapping} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class EventWorkflowMappingRepository extends DefaultCrudRepository<
  EventWorkflowMapping,
  typeof EventWorkflowMapping.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(EventWorkflowMapping, dataSource);
  }
}

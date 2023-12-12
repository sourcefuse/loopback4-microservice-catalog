import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {EventWorkflows} from '../models';
import {TaskDbSourceName} from '../types';

export class EventWorkflowMappingRepository extends DefaultCrudRepository<
  EventWorkflows,
  typeof EventWorkflows.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(EventWorkflows, dataSource);
  }
}

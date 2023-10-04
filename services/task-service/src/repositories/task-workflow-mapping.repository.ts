import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {TaskWorkflows} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class TaskWorkFlowMappingRepository extends DefaultCrudRepository<
  TaskWorkflows,
  typeof TaskWorkflows.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(TaskWorkflows, dataSource);
  }
}

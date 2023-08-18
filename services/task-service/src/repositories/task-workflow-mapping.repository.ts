import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {TaskWorkFlowMapping} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class TaskWorkFlowMappingRepository extends DefaultCrudRepository<
  TaskWorkFlowMapping,
  typeof TaskWorkFlowMapping.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(TaskWorkFlowMapping, dataSource);
  }
}

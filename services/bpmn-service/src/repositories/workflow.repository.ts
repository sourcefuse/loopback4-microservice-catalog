import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Workflow} from '../models';
import {WorkflowCacheSourceName} from '../types';

export class WorkflowRepository extends DefaultCrudRepository<
  Workflow,
  typeof Workflow.prototype.id
> {
  constructor(
    @inject(`datasources.${WorkflowCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Workflow, dataSource);
  }
}

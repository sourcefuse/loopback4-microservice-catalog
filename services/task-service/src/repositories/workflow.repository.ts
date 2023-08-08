import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Workflow} from '../models';
import {inject} from '@loopback/context';
import {TaskDbSourceName} from '../types';

export class WorkflowRepository extends DefaultCrudRepository<
  Workflow,
  typeof Workflow.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    datasource: juggler.DataSource,
  ) {
    super(Workflow, datasource);
  }
}

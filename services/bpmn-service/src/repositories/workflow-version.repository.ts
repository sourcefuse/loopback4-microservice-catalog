import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {WorkflowVersion, WorkflowVersionRelations, Workflow} from '../models';
import {BpmnDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WorkflowRepository} from './workflow.repository';

export class WorkflowVersionRepository extends DefaultCrudRepository<
  WorkflowVersion,
  typeof WorkflowVersion.prototype.version,
  WorkflowVersionRelations
> {

  public readonly workflow: BelongsToAccessor<Workflow, typeof WorkflowVersion.prototype.version>;

  constructor(
    @inject('datasources.BpmnDb') dataSource: BpmnDbDataSource, @repository.getter('WorkflowRepository') protected workflowRepositoryGetter: Getter<WorkflowRepository>,
  ) {
    super(WorkflowVersion, dataSource);
    this.workflow = this.createBelongsToAccessorFor('workflow', workflowRepositoryGetter,);
    this.registerInclusionResolver('workflow', this.workflow.inclusionResolver);
  }
}

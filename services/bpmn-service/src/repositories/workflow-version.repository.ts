import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {Workflow, WorkflowVersion, WorkflowVersionRelations} from '../models';
import {WorkflowCacheSourceName} from '../types';
import {WorkflowRepository} from './workflow.repository';

export class WorkflowVersionRepository extends DefaultCrudRepository<
  WorkflowVersion,
  typeof WorkflowVersion.prototype.id,
  WorkflowVersionRelations
> {
  public readonly workflow: BelongsToAccessor<
    Workflow,
    typeof WorkflowVersion.prototype.id
  >;
  constructor(
    @inject(`datasources.${WorkflowCacheSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('WorkflowRepository')
    protected workflowRepositoryGetter: Getter<WorkflowRepository>,
  ) {
    super(WorkflowVersion, dataSource);
    this.workflow = this.createBelongsToAccessorFor(
      'workflow',
      workflowRepositoryGetter,
    );
    this.registerInclusionResolver('workflow', this.workflow.inclusionResolver);
  }
}

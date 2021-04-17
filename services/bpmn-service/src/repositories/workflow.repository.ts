import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Workflow, WorkflowRelations, WorkflowVersion} from '../models';
import {WorkflowCacheSourceName} from '../types';
import {WorkflowVersionRepository} from './workflow-version.repository';

export class WorkflowRepository extends DefaultCrudRepository<
  Workflow,
  typeof Workflow.prototype.id,
  WorkflowRelations
> {
  public readonly workflowVersions: HasManyRepositoryFactory<
    WorkflowVersion,
    typeof Workflow.prototype.id
  >;

  constructor(
    @inject(`datasources.${WorkflowCacheSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('WorkflowVersionRepository')
    protected workflowVersionRepositoryGetter: Getter<WorkflowVersionRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Workflow, dataSource);
    this.workflowVersions = this.createHasManyRepositoryFactoryFor(
      'workflowVersions',
      workflowVersionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'workflowVersions',
      this.workflowVersions.inclusionResolver,
    );
  }
}

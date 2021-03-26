import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {Workflow, WorkflowRelations, WorkflowVersion} from '../models';
import {BpmnDbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {WorkflowVersionRepository} from './workflow-version.repository';
import {DefaultUserModifyCrudRepository, IAuthUserWithPermissions} from '@sourceloop/core';

export class WorkflowRepository extends DefaultUserModifyCrudRepository<Workflow,
  typeof Workflow.prototype.id,
  WorkflowRelations> {

  public readonly workflowVersions: HasManyRepositoryFactory<WorkflowVersion, typeof Workflow.prototype.id>;

  constructor(
    @inject('datasources.BpmnDb') dataSource: BpmnDbDataSource,
    @repository.getter('WorkflowVersionRepository')
    protected workflowVersionRepositoryGetter: Getter<WorkflowVersionRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<IAuthUserWithPermissions | undefined>) {
    super(Workflow, dataSource, getCurrentUser);
    this.workflowVersions = this.createHasManyRepositoryFactoryFor('workflowVersions', workflowVersionRepositoryGetter);
    this.registerInclusionResolver('workflowVersions', this.workflowVersions.inclusionResolver);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Workflow, WorkflowRelations, WorkflowVersion} from '../../models';
import {WorkflowCacheSourceName} from '../../types';
import {WorkflowVersionRepository} from './workflow-version.repository';
export class WorkflowRepository extends SequelizeUserModifyCrudRepository<
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
    dataSource: SequelizeDataSource,
    @repository.getter('WorkflowVersionRepository')
    protected workflowVersionRepositoryGetter: Getter<WorkflowVersionRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Workflow, dataSource, getCurrentUser);
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

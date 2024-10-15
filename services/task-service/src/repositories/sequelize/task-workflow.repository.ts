import {Getter, inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TaskWorkflow} from '../../models';
import {TaskDbSourceName} from '../../types';

export class TaskWorkFlowRepository extends SequelizeUserModifyCrudRepository<
  TaskWorkflow,
  typeof TaskWorkflow.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.TaskWorkflow')
    private readonly taskWorkflow: typeof Entity & {prototype: TaskWorkflow},
  ) {
    super(taskWorkflow, dataSource, userGetter);
  }
}

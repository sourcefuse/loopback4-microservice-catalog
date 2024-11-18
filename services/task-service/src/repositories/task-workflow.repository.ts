import {Getter, inject} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TaskWorkflow} from '../models';
import {TaskDbSourceName} from '../types';

export class TaskWorkFlowRepository extends DefaultUserModifyCrudRepository<
  TaskWorkflow,
  typeof TaskWorkflow.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.TaskWorkflow')
    private readonly taskWorkflow: typeof Entity & {prototype: TaskWorkflow},
  ) {
    super(taskWorkflow, dataSource, userGetter);
  }
}

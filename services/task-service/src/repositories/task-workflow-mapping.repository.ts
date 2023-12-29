import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TaskWorkflows} from '../models';
import {TaskDbSourceName} from '../types';

export class TaskWorkFlowMappingRepository extends DefaultUserModifyCrudRepository<
  TaskWorkflows,
  typeof TaskWorkflows.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private userGetter: Getter<IAuthUserWithPermissions>,
  ) {
    super(TaskWorkflows, dataSource, userGetter);
  }
}

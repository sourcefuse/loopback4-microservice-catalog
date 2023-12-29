import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {UserTask} from '../models';
import {TaskDbSourceName} from '../types';

export class UserTaskRepository extends DefaultUserModifyCrudRepository<
  UserTask,
  typeof UserTask.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private userGetter: Getter<IAuthUserWithPermissions>,
  ) {
    super(UserTask, dataSource, userGetter);
  }
}

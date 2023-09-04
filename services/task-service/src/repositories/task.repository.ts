import {juggler} from '@loopback/repository';
import {Task} from '../models';
import {Getter, inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

export class TaskRepository extends DefaultUserModifyCrudRepository<
  Task,
  typeof Task.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Task, dataSource, getCurrentUser);
  }
}

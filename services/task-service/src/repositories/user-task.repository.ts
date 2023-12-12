import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserTask} from '../models';
import {TaskDbSourceName} from '../types';

export class UserTaskRepository extends DefaultCrudRepository<
  UserTask,
  typeof UserTask.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(UserTask, dataSource);
  }
}

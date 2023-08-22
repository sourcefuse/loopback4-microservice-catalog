import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Task} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Task, dataSource);
  }
}

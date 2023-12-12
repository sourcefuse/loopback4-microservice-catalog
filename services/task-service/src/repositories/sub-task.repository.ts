import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {SubTask} from '../models';
import {TaskDbSourceName} from '../types';

export class SubTaskRepository extends DefaultCrudRepository<
  SubTask,
  typeof SubTask.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(SubTask, dataSource);
  }
}

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Tasks} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class TaskRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Tasks, dataSource);
  }
}

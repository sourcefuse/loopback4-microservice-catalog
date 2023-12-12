import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {SubTask, Task} from '../models';
import {TaskDbSourceName} from '../types';
import {SubTaskRepository} from './sub-task.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id
> {
  public readonly subTasks: HasManyRepositoryFactory<
    SubTask,
    typeof SubTask.prototype.id
  >;
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('SubTaskRepository')
    subTaskRepo: Getter<SubTaskRepository>,
  ) {
    super(Task, dataSource);
    this.subTasks = this.createHasManyRepositoryFactoryFor(
      'subTasks',
      subTaskRepo,
    );
  }
}

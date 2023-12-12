import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {Task, UserTask} from '../models';
import {TaskDbSourceName} from '../types';
import {UserTaskRepository} from './user-task.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id
> {
  public readonly userTasks: HasManyRepositoryFactory<
    UserTask,
    typeof UserTask.prototype.id
  >;
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('SubTaskRepository')
    subTaskRepo: Getter<UserTaskRepository>,
  ) {
    super(Task, dataSource);
    this.userTasks = this.createHasManyRepositoryFactoryFor(
      'subTasks',
      subTaskRepo,
    );
  }
}

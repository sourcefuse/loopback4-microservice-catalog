import {Getter, inject} from '@loopback/core';
import {
  Entity,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Task, UserTask} from '../models';
import {TaskDbSourceName} from '../types';
import {UserTaskRepository} from './user-task.repository';

export class TaskRepository extends DefaultUserModifyCrudRepository<
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
    @repository.getter('UserTaskRepository')
    userTaskRepo: Getter<UserTaskRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.Task')
    private readonly task: typeof Entity & {prototype: Task},
  ) {
    super(task, dataSource, userGetter);
    this.userTasks = this.createHasManyRepositoryFactoryFor(
      'userTasks',
      userTaskRepo,
    );
  }
}

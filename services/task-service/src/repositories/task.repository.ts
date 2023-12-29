import {Getter, inject} from '@loopback/core';
import {
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
    @repository.getter('SubTaskRepository')
    subTaskRepo: Getter<UserTaskRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private userGetter: Getter<IAuthUserWithPermissions>,
  ) {
    super(Task, dataSource, userGetter);
    this.userTasks = this.createHasManyRepositoryFactoryFor(
      'subTasks',
      subTaskRepo,
    );
  }
}

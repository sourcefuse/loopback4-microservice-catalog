import {Getter, inject} from '@loopback/core';
import {
  Entity,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Task, UserTask} from '../../models';
import {TaskDbSourceName} from '../../types';
import {UserTaskRepository} from './user-task.repository';

export class TaskRepository extends SequelizeUserModifyCrudRepository<
  Task,
  typeof Task.prototype.id
> {
  public readonly userTasks: HasManyRepositoryFactory<
    UserTask,
    typeof UserTask.prototype.id
  >;
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
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

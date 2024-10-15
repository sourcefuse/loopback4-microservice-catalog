import {Getter, inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {UserTask} from '../../models';
import {TaskDbSourceName} from '../../types';
export class UserTaskRepository extends SequelizeUserModifyCrudRepository<
  UserTask,
  typeof UserTask.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.UserTask')
    private readonly userTask: typeof Entity & {prototype: UserTask},
  ) {
    super(userTask, dataSource, userGetter);
  }
}

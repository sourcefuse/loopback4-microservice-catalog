import {
  repository,
  BelongsToAccessor,
  AnyObject,
  Filter,
  DataObject,
  juggler,
} from '@loopback/repository';
import {Group, Message, Thread} from '../models';
import {inject, Getter} from '@loopback/core';
import {MessageRepository} from './message.repository';
import {ThreadRepository} from './thread.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {repositoryHelper} from '../helpers';

export class GroupRepository extends DefaultUserModifyCrudRepository<
  Group,
  typeof Group.prototype.id
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof Group.prototype.id
  >;

  public readonly thread: BelongsToAccessor<Thread, typeof Group.prototype.id>;

  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Group, dataSource, getCurrentUser);
  }
  async updateById(
    id: string,
    entity: DataObject<Group>,
    options?: AnyObject,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    entity.modifiedBy = currentUser?.id;
    entity.modifiedOn = new Date();
    return super.updateById(id, entity, options);
  }
  async update(entity: Group, options?: AnyObject | undefined): Promise<void> {
    const user = await this.getCurrentUser();
    entity.modifiedBy = user?.id;
    entity.modifiedOn = new Date();
    return super.update(entity, options);
  }
  async find(
    filter: Filter<Group> | undefined,
    options?: AnyObject,
  ): Promise<Group[]> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.find(filter, options);
  }
  async findOne(
    filter?: Filter<Group> | undefined,
    options?: AnyObject | undefined,
  ): Promise<Group | null> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.findOne(filter, options);
  }
}

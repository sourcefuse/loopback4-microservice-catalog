import {
  repository,
  HasManyRepositoryFactory,
  DataObject,
  Filter,
  AnyObject,
  juggler,
} from '@loopback/repository';
import {Thread, Message, Group} from '../models';
import {inject, Getter} from '@loopback/core';
import {MessageRepository} from './message.repository';
import {Options} from '@loopback/repository/src/common-types';
import {GroupRepository} from './group.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {repositoryHelper} from '../helpers';

export class ThreadRepository extends DefaultUserModifyCrudRepository<
  Thread,
  typeof Thread.prototype.id
> {
  public readonly messages: HasManyRepositoryFactory<
    Message,
    typeof Thread.prototype.id
  >;

  public readonly groups: HasManyRepositoryFactory<
    Group,
    typeof Thread.prototype.id
  >;

  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @repository.getter('MessageRepository')
    protected messageRepositoryGetter: Getter<MessageRepository>,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Thread, dataSource, getCurrentUser);
    this.groups = this.createHasManyRepositoryFactoryFor(
      'group',
      groupRepositoryGetter,
    );
    this.registerInclusionResolver('group', this.groups.inclusionResolver);
    this.messages = this.createHasManyRepositoryFactoryFor(
      'message',
      messageRepositoryGetter,
    );
    this.registerInclusionResolver('message', this.messages.inclusionResolver);
  }
  async create(
    entity: DataObject<Thread>,
    options?: AnyObject | undefined,
  ): Promise<Thread> {
    const currentUser = await this.getCurrentUser();
    entity.createdBy = currentUser?.id;
    entity.createdOn = new Date();
    return super.create(entity, options);
  }
  async incrementOrCreate(
    id: typeof Thread.prototype.id | undefined,
    entity: DataObject<Thread>,
    options?: Options,
  ) {
    if (!id) {
      return this.create(entity, options);
    }
    const thread = await this.findById(id);
    if (!thread) {
      return this.create(entity, options);
    }
    await this.updateById(
      id,
      {messageCounts: thread.messageCounts + 1},
      options,
    );
    return thread;
  }
  async updateById(
    id: string,
    entity: DataObject<Thread>,
    options?: AnyObject,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    entity.modifiedBy = currentUser?.id;
    entity.modifiedOn = new Date();
    return super.updateById(id, entity, options);
  }
  async update(entity: Thread, options?: AnyObject | undefined): Promise<void> {
    const user = await this.getCurrentUser();
    entity.modifiedBy = user?.id;
    entity.modifiedOn = new Date();
    return super.update(entity, options);
  }
  async find(
    filter: Filter<Thread> | undefined,
    options?: AnyObject,
  ): Promise<Thread[]> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.find(filter, options);
  }
  async findOne(
    filter?: Filter<Thread> | undefined,
    options?: AnyObject | undefined,
  ): Promise<Thread | null> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.findOne(filter, options);
  }
}

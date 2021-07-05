import {
  repository,
  HasManyRepositoryFactory,
  DataObject,
  juggler,
} from '@loopback/repository';
import {Thread, Message, Group, Attachment} from '../models';
import {inject, Getter} from '@loopback/core';
import {AttachmentRepository} from './attachment.repository';
import {MessageRepository} from './message.repository';
import {Options} from '@loopback/repository/src/common-types';
import {GroupRepository} from './group.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {InMailDatasourceName} from '../keys';

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

  public readonly attachments: HasManyRepositoryFactory<
    Attachment,
    typeof Attachment.prototype.id
  >;

  constructor(
    @inject(`datasources.${InMailDatasourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('MessageRepository')
    protected messageRepositoryGetter: Getter<MessageRepository>,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('AttachmentRepository')
    protected attachmentRepositoryGetter: Getter<AttachmentRepository>,
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
}

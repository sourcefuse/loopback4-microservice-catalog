// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
import {InMailDatasourceName} from '../keys';
import {Attachment, Group, Message, Thread} from '../models';
import {AttachmentRepository} from './attachment.repository';
import {GroupRepository} from './group.repository';
import {MessageRepository} from './message.repository';

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
}
//   async incrementOrCreate(
//     id: typeof Thread.prototype.id | undefined,
//     entity: DataObject<Thread>,
//     options?: Options,
//   ) {
//     if (!id) {
//       return this.create(entity, options);
//     }
//     const thread = await this.findById(id);
//     if (!thread) {
//       return this.create(entity, options);
//     }
//     await this.updateById(
//       id,
//       {messageCounts: thread.messageCounts + 1},
//       options,
//     );
//     return thread;
//   }
// }

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {DefaultTransactionSoftCrudRepository} from 'loopback4-soft-delete';
import {InMailDatasourceName} from '../keys';
import {
  Attachment,
  Group,
  Message,
  MessageRelations,
  Meta,
  Thread,
} from '../models';
import {AttachmentRepository} from './attachment.repository';
import {GroupRepository} from './group.repository';
import {MetaRepository} from './meta.repository';

export class MessageRepository extends DefaultTransactionSoftCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {
  public readonly attachments: HasManyRepositoryFactory<
    Attachment,
    typeof Message.prototype.id
  >;

  public readonly groups: HasManyRepositoryFactory<
    Group,
    typeof Message.prototype.id
  >;

  public readonly meta: HasManyRepositoryFactory<
    Meta,
    typeof Message.prototype.id
  >;

  public readonly thread: BelongsToAccessor<
    Thread,
    typeof Message.prototype.id
  >;

  constructor(
    @inject(`datasources.${InMailDatasourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('AttachmentRepository')
    protected attachmentRepositoryGetter: Getter<AttachmentRepository>,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('MetaRepository')
    protected metaRepositoryGetter: Getter<MetaRepository>,
  ) {
    super(Message, dataSource);
    this.meta = this.createHasManyRepositoryFactoryFor(
      'meta',
      metaRepositoryGetter,
    );
    this.registerInclusionResolver('meta', this.meta.inclusionResolver);
    this.groups = this.createHasManyRepositoryFactoryFor(
      'group',
      groupRepositoryGetter,
    );
    this.registerInclusionResolver('group', this.groups.inclusionResolver);
    this.attachments = this.createHasManyRepositoryFactoryFor(
      'attachment',
      attachmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'attachment',
      this.attachments.inclusionResolver,
    );
  }
}

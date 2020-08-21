import {
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
  DefaultTransactionalRepository,
  AnyObject,
  Filter,
  juggler,
} from '@loopback/repository';
import {
  Message,
  MessageRelations,
  Attachment,
  Group,
  Meta,
  Thread,
  MessageWithRelations,
} from '../models';
import {inject, Getter} from '@loopback/core';
import {AttachmentRepository} from './attachment.repository';
import {GroupRepository} from './group.repository';
import {MetaRepository} from './meta.repository';
import {DataObject, Options} from '@loopback/repository/src/common-types';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {repositoryHelper} from '../helpers';

export class MessageRepository extends DefaultTransactionalRepository<
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
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @repository.getter('AttachmentRepository')
    protected attachmentRepositoryGetter: Getter<AttachmentRepository>,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('MetaRepository')
    protected metaRepositoryGetter: Getter<MetaRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
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

  async createRelational(
    entity: DataObject<MessageWithRelations>,
    options?: Options,
  ): Promise<Message> {
    const transaction = await this.beginTransaction();
    const extractedEntity = (({
      meta = [],
      attachments = [],
      groups = [],
      ...o
    }) => ({meta, attachments, groups, message: o}))(entity);
    try {
      const currentUser = await this.getCurrentUser();
      const createdOnBy = {
        createdBy: currentUser?.id,
        createdOn: new Date(),
      };

      const transactionOptions = Object.assign({}, options, {transaction});

      Object.assign(extractedEntity.message, createdOnBy);
      const message = await this.create(extractedEntity.message);

      entity.groups &&
        (await Promise.all(
          (entity.groups as Array<Group>).map(group => {
            Object.assign(group, createdOnBy);
            return this.groups(message.id).create(group, transactionOptions);
          }),
        ));
      entity.meta &&
        (await Promise.all(
          (entity.meta as Array<Meta>).map(meta => {
            Object.assign(meta, createdOnBy);
            return this.meta(message.id).create(meta, transactionOptions);
          }),
        ));
      entity.attachments &&
        (await Promise.all(
          (entity.attachments as Array<Attachment>).map(attachment => {
            Object.assign(attachment, createdOnBy);
            return this.attachments(message.id).create(
              attachment,
              transactionOptions,
            );
          }),
        ));
      await transaction.commit();
      return message;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
  async create(
    entity: DataObject<Thread>,
    options?: AnyObject | undefined,
  ): Promise<Message> {
    const currentUser = await this.getCurrentUser();
    entity.createdBy = currentUser?.id;
    entity.createdOn = new Date();
    return super.create(entity, options);
  }
  async updateById(
    id: string,
    entity: DataObject<Message>,
    options?: AnyObject,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    entity.modifiedBy = currentUser?.id;
    entity.modifiedOn = new Date();
    return super.updateById(id, entity, options);
  }
  async update(
    entity: Message,
    options?: AnyObject | undefined,
  ): Promise<void> {
    const user = await this.getCurrentUser();
    entity.modifiedBy = user?.id;
    entity.modifiedOn = new Date();
    return super.update(entity, options);
  }
  async find(
    filter: Filter<Message> | undefined,
    options?: AnyObject,
  ): Promise<(Message & MessageRelations)[]> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.find(filter, options);
  }
  async findOne(
    filter?: Filter<Message> | undefined,
    options?: AnyObject | undefined,
  ): Promise<(Message & MessageRelations) | null> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.findOne(filter, options);
  }
}

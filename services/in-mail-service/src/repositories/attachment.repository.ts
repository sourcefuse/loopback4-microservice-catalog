import {
  DefaultCrudRepository,
  BelongsToAccessor,
  Filter,
  AnyObject,
  DataObject,
  juggler,
} from '@loopback/repository';
import {Attachment, Message} from '../models';
import {inject, Getter} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {repositoryHelper} from '../helpers';

export class AttachmentRepository extends DefaultCrudRepository<
  Attachment,
  typeof Attachment.prototype.id
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof Attachment.prototype.id
  >;

  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Attachment, dataSource);
  }
  async create(
    entity: DataObject<Attachment>,
    options?: AnyObject | undefined,
  ): Promise<Attachment> {
    const currentUser = await this.getCurrentUser();
    entity.createdBy = currentUser?.id;
    entity.createdOn = new Date();
    return super.create(entity, options);
  }
  async updateById(
    id: string,
    entity: DataObject<Attachment>,
    options?: AnyObject,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    entity.modifiedBy = currentUser?.id;
    entity.modifiedOn = new Date();
    return super.updateById(id, entity, options);
  }
  async update(
    entity: Attachment,
    options?: AnyObject | undefined,
  ): Promise<void> {
    const user = await this.getCurrentUser();
    entity.modifiedBy = user?.id;
    entity.modifiedOn = new Date();
    return super.update(entity, options);
  }
  async find(
    filter: Filter<Attachment> | undefined,
    options?: AnyObject,
  ): Promise<Attachment[]> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.find(filter, options);
  }
  async findOne(
    filter?: Filter<Attachment> | undefined,
    options?: AnyObject | undefined,
  ): Promise<Attachment | null> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.findOne(filter, options);
  }
}

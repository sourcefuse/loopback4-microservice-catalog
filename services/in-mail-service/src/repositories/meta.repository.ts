import {
  repository,
  BelongsToAccessor,
  Filter,
  AnyObject,
  DataObject,
  juggler,
} from '@loopback/repository';
import {Meta, Message} from '../models';
import {inject, Getter} from '@loopback/core';
import {MessageRepository} from './message.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {repositoryHelper} from '../helpers';

export class MetaRepository extends DefaultUserModifyCrudRepository<
  Meta,
  typeof Meta.prototype.id
> {
  public readonly message: BelongsToAccessor<Message, typeof Meta.prototype.id>;

  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Meta, dataSource, getCurrentUser);
  }
  async create(
    entity: DataObject<Meta>,
    options?: AnyObject | undefined,
  ): Promise<Meta> {
    const currentUser = await this.getCurrentUser();
    entity.createdBy = currentUser?.id;
    entity.createdOn = new Date();
    return super.create(entity, options);
  }
  async updateById(
    id: string,
    entity: DataObject<Meta>,
    options?: AnyObject,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    entity.modifiedBy = currentUser?.id;
    entity.modifiedOn = new Date();
    return super.updateById(id, entity, options);
  }
  async update(entity: Meta, options?: AnyObject | undefined): Promise<void> {
    const user = await this.getCurrentUser();
    entity.modifiedBy = user?.id;
    entity.modifiedOn = new Date();
    return super.update(entity, options);
  }
  async find(
    filter: Filter<Meta> | undefined,
    options?: AnyObject,
  ): Promise<Meta[]> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.find(filter, options);
  }
  async findOne(
    filter?: Filter<Meta> | undefined,
    options?: AnyObject | undefined,
  ): Promise<Meta | null> {
    repositoryHelper.addFalseDeletedConditionInInclude(filter);
    repositoryHelper.addFalseDeletedConditionInWhere(filter);
    repositoryHelper.removeDeletedAttributeFromFilter(filter);
    return super.findOne(filter, options);
  }
}

import {
  Count,
  DataObject,
  Entity,
  Getter,
  juggler,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Options} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {SoftCrudRepository} from 'loopback4-soft-delete';

import {IAuthUserWithPermissions} from '../components';
import {UserModifiableEntity} from '../models';

export class DefaultUserModifyCrudRepository<
  T extends UserModifiableEntity,
  ID,
  Relations extends object = {},
> extends SoftCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(entityClass, dataSource);
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.createdBy = uid;
    entity.modifiedBy = uid;
    return super.create(entity, options);
  }

  async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entities.forEach(entity => {
      entity.createdBy = uid ?? '';
      entity.modifiedBy = uid ?? '';
    });
    return super.createAll(entities, options);
  }

  async save(entity: T, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.modifiedBy = uid;
    return super.save(entity, options);
  }

  async update(entity: T, options?: Options): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.modifiedBy = uid;
    return super.update(entity, options);
  }

  async updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    data.modifiedBy = uid;
    return super.updateAll(data, where, options);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    data.modifiedBy = uid;
    return super.updateById(id, data, options);
  }
  async replaceById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    data.modifiedBy = uid;
    return super.replaceById(id, data, options);
  }
}

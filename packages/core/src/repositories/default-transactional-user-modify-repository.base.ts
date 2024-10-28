﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {
  Count,
  DataObject,
  Entity,
  Getter,
  Where,
  juggler,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Options} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {DefaultTransactionSoftCrudRepository} from 'loopback4-soft-delete';
import {IAuthUserWithPermissions} from '../components';
import {SFCoreBindings} from '../keys';
import {UserModifiableEntity} from '../models';
import {IDefaultUserModifyCrud} from '../types';

export abstract class DefaultTransactionalUserModifyRepository<
  T extends UserModifiableEntity,
  ID,
  Relations extends object = {},
> extends DefaultTransactionSoftCrudRepository<T, ID, Relations> {
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

  @inject(SFCoreBindings.DEFAULT_USER_MODIFY_CRUD_SERVICE)
  public defaultUserModifyCrudService: IDefaultUserModifyCrud<T, ID>;

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.createdBy = uid;
    entity.modifiedBy = uid;
    entity = await this.defaultUserModifyCrudService.create(entity);
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
    entities = await this.defaultUserModifyCrudService.createAll(entities);
    return super.createAll(entities, options);
  }

  async save(entity: T, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.modifiedBy = uid;
    entity = await this.defaultUserModifyCrudService.save(entity);
    return super.save(entity, options);
  }

  async update(entity: T, options?: Options): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    const uid = currentUser?.userTenantId ?? currentUser?.id;
    entity.modifiedBy = uid;
    entity = await this.defaultUserModifyCrudService.update(entity);
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
    const result = await this.defaultUserModifyCrudService.updateAll(
      data,
      where,
    );
    return super.updateAll(result.data, result.where, options);
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
    data = await this.defaultUserModifyCrudService.updateById(id, data);
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
    data = await this.defaultUserModifyCrudService.replaceById(id, data);
    return super.replaceById(id, data, options);
  }
}

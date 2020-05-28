import {
  AndClause,
  Condition,
  Count,
  DataObject,
  Filter,
  Getter,
  juggler,
  OrClause,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Options} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {IAuthUserWithPermissions} from '@sourcefuse-service-catalog/core';
import {UserModifiableEntity} from '../models';

export abstract class DefaultUserModifyCrudRepository<
  T extends UserModifiableEntity,
  ID,
  Relations extends object = {}
> extends SoftCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof UserModifiableEntity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(entityClass, dataSource);
  }

  find(filter?: Filter<T>, options?: Options): Promise<(T & Relations)[]> {
    if (
      filter?.where &&
      (filter.where as AndClause<T>).and &&
      (filter.where as AndClause<T>).and.length > 0
    ) {
      (filter.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter.where as OrClause<T>).or &&
      (filter.where as OrClause<T>).or.length > 0
    ) {
      filter = {
        where: {
          and: [
            {
              deleted: false,
            } as Condition<T>,
            {
              or: (filter.where as OrClause<T>).or,
            },
          ],
        },
      };
    } else {
      // Do nothing
    }
    return super.find(filter, options);
  }

  findOne(filter?: Filter<T>, options?: Options): Promise<T & Relations| null> {
    if (
      filter?.where &&
      (filter.where as AndClause<T>).and &&
      (filter.where as AndClause<T>).and.length > 0
    ) {
      (filter.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter.where as OrClause<T>).or &&
      (filter.where as OrClause<T>).or.length > 0
    ) {
      filter = {
        where: {
          and: [
            {
              deleted: false,
            } as Condition<T>,
            {
              or: (filter.where as OrClause<T>).or,
            },
          ],
        },
      };
    } else {
      // Do nothing
    }
    return super.findOne(filter, options);
  }

  findById(
    id: ID,
    filter?: Filter<T>,
    options?: Options,
  ): Promise<T & Relations> {
    if (
      filter?.where &&
      (filter.where as AndClause<T>).and &&
      (filter.where as AndClause<T>).and.length > 0
    ) {
      (filter.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter.where as OrClause<T>).or &&
      (filter.where as OrClause<T>).or.length > 0
    ) {
      filter = {
        where: {
          and: [
            {
              deleted: false,
            } as Condition<T>,
            {
              or: (filter.where as OrClause<T>).or,
            },
          ],
        },
      };
    } else {
      // Do nothing
    }
    return super.findById(id, filter, options);
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.createdBy = currentUser.id as number;
    entity.modifiedBy = currentUser.id as number;
    return super.create(entity, options);
  }

  async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entities.forEach(entity => {
      entity.createdBy = currentUser ? (currentUser.id as number) : 0;
      entity.modifiedBy = currentUser ? (currentUser.id as number) : 0;
    });
    return super.createAll(entities, options);
  }

  async save(entity: T, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.id as number;
    return super.save(entity, options);
  }

  async update(entity: T, options?: Options): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.id as number;
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
    data.modifiedBy = currentUser.id as number;
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
    data.modifiedBy = currentUser.id as number;
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
    data.modifiedBy = currentUser.id as number;
    return super.replaceById(id, data, options);
  }
}

import {
  Count,
  DataObject,
  Getter,
  juggler,
  Where,
  Filter,
  AndClause,
  OrClause,
  Condition,
  AnyObject,
  DefaultTransactionalRepository,
  Entity,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Options} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '../components';
import {UserModifiableEntity} from '../models';

export abstract class DefaultTransactionalUserModifyRepository<
  T extends UserModifiableEntity,
  ID,
  Relations extends object = {},
> extends DefaultTransactionalRepository<T, ID, Relations> {
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

  find(filter?: Filter<T>, options?: Options): Promise<(T & Relations)[]> {
    if (
      filter?.where &&
      (filter?.where as AndClause<T>).and &&
      (filter?.where as AndClause<T>).and.length > 0
    ) {
      (filter?.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter?.where as OrClause<T>).or &&
      (filter?.where as OrClause<T>).or.length > 0
    ) {
      (filter?.where as AndClause<T>).and = [];
      (filter?.where as AndClause<T>).and.push(
        {
          deleted: false,
        } as Condition<T>,
        {
          or: (filter?.where as OrClause<T>).or,
        },
      );
    } else {
      // Do nothing
    }
    return super.find(filter, options);
  }

  findOne(
    filter?: Filter<T> | undefined,
    options?: AnyObject | undefined,
  ): Promise<(T & Relations) | null> {
    if (
      filter?.where &&
      (filter?.where as AndClause<T>).and &&
      (filter?.where as AndClause<T>).and.length > 0
    ) {
      (filter?.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter?.where as OrClause<T>).or &&
      (filter?.where as OrClause<T>).or.length > 0
    ) {
      (filter?.where as AndClause<T>).and = [];
      (filter?.where as AndClause<T>).and.push(
        {
          deleted: false,
        } as Condition<T>,
        {
          or: (filter?.where as OrClause<T>).or,
        },
      );
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
      (filter?.where as AndClause<T>).and &&
      (filter?.where as AndClause<T>).and.length > 0
    ) {
      (filter?.where as AndClause<T>).and.push({
        deleted: false,
      } as Condition<T>);
    } else if (
      filter?.where &&
      (filter?.where as OrClause<T>).or &&
      (filter?.where as OrClause<T>).or.length > 0
    ) {
      (filter?.where as AndClause<T>).and = [];
      (filter?.where as AndClause<T>).and.push(
        {
          deleted: false,
        } as Condition<T>,
        {
          or: (filter?.where as OrClause<T>).or,
        },
      );
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
    entity.createdBy = currentUser.id;
    entity.modifiedBy = currentUser.id;
    return super.create(entity, options);
  }

  async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
    let currentUser = await this.getCurrentUser();
    currentUser = currentUser ?? options?.currentUser;
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entities.forEach(entity => {
      entity.createdBy = currentUser ? currentUser.id : '';
      entity.modifiedBy = currentUser ? currentUser.id : '';
    });
    return super.createAll(entities, options);
  }

  async save(entity: T, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.id;
    return super.save(entity, options);
  }

  async update(entity: T, options?: Options): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.id;
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
    data.modifiedBy = currentUser.id;
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
    data.modifiedBy = currentUser.id;
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
    data.modifiedBy = currentUser.id;
    return super.replaceById(id, data, options);
  }

  async deleteAllHard(where?: Where<T>, options?: Options): Promise<Count> {
    return super.deleteAll(where, options);
  }

  async deleteByIdHard(id: ID, options?: Options): Promise<void> {
    return super.deleteById(id, options);
  }

  async deleteById(id: ID, options?: Options): Promise<void> {
    // Do soft delete, no hard delete allowed
    return super.updateById(
      id,
      {
        deleted: true,
      } as DataObject<T>,
      options,
    );
  }

  async deleteAll(where?: Where<T>, options?: Options): Promise<Count> {
    // Do soft delete, no hard delete allowed
    return super.updateAll(
      {
        deleted: true,
      } as DataObject<T>,
      where,
      options,
    );
  }
}

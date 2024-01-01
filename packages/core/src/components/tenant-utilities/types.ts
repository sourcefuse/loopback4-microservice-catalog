import {
  Count,
  DataObject,
  Entity,
  Filter,
  FilterExcludingWhere,
  Options,
  Where,
} from '@loopback/repository';
import {AbstractConstructor} from '../../mixins/types';
import {IAuthUserWithPermissions} from '../bearer-verifier';
import {TenantType} from './enums';

export interface ITenantUtilitiesOptions {
  errorKey: string;
}

export type EntityWithTenantId = Entity & {
  tenantId: string;
};
export interface ICrudRepository<
  T extends Entity,
  ID,
  Relations extends Object,
> {
  create(entity: DataObject<T>, options?: Options): Promise<T>;
  createAll(entities: DataObject<T>[], options?: Options): Promise<T[]>;
  save(entity: T, options?: Options): Promise<T>;
  find(filter?: Filter<T>, options?: Options): Promise<(T & Relations)[]>;
  findOne(
    filter?: Filter<T>,
    options?: Options,
  ): Promise<(T & Relations) | null>;
  findById(
    id: ID,
    filter?: FilterExcludingWhere<T>,
    options?: Options,
  ): Promise<T & Relations>;
  update(entity: T, options?: Options): Promise<void>;
  delete(entity: T, options?: Options): Promise<void>;
  updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count>;
  updateById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
  replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
  deleteAll(where?: Where<T>, options?: Options): Promise<Count>;
  deleteById(id: ID, options?: Options): Promise<void>;
  count(where?: Where<T>, options?: Options): Promise<Count>;
  exists(id: ID, options?: Options): Promise<boolean>;
}

export interface ITenantGuard<T extends Entity, ID> {
  find(filter?: Filter<T>): Promise<Filter<T>>;
  findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<Filter<T>>;
  findOne(filter?: Filter<T>): Promise<Filter<T>>;
  count(where?: Where<T>): Promise<Where<T>>;
  exists(id: ID): Promise<Where<T>>;
  create(data: DataObject<T>): Promise<DataObject<T>>;
  createAll(data: DataObject<T>[]): Promise<DataObject<T>[]>;
  save(entity: T): Promise<T>;
  update(data: T): Promise<{
    data: T;
    where: Where<T>;
  }>;
  updateAll(
    data: DataObject<T>,
    where?: Where<T> | undefined,
  ): Promise<{
    data: DataObject<T>;
    where: Where<T>;
  }>;
  updateById(
    id: ID,
    data: DataObject<T>,
  ): Promise<{
    data: DataObject<T>;
    where: Where<T>;
  }>;
  replaceById(
    id: ID,
    data: DataObject<T>,
  ): Promise<{
    data: DataObject<T>;
    where: Where<T>;
  }>;
  delete(entity: T): Promise<{
    where: Where<T>;
    entity: T;
  }>;
  deleteAll(where?: Where<T>): Promise<Where<T>>;
  deleteById(id: ID): Promise<Where<T>>;
  skipTenantGuard(): Promise<boolean>;
}

abstract class WithTenantGuard<T extends EntityWithTenantId, ID> {
  abstract tenantGuardService: ITenantGuard<T, ID>;
}

export type AbstractConstructorWithGuard<
  M extends EntityWithTenantId,
  ID,
> = AbstractConstructor<WithTenantGuard<M, ID>>;

export interface UserInToken extends IAuthUserWithPermissions {
  tenantType?: TenantType;
}

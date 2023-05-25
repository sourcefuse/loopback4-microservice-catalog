// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Entity,
  Filter,
  FilterExcludingWhere,
  JugglerDataSource,
  Options,
} from '@loopback/repository';
import {ICacheStrategy} from './strategies';
import {CacheStrategyTypes} from './strategy-types.enum';
import {SequelizeDataSource} from '@loopback/sequelize';

/**
 * Interface defining the component's options object
 */
export interface CachePluginComponentOptions {
  // Add the definitions here
  cacheProvider: CacheStrategyTypes;
  prefix: string;
  ttl: number;
}

/**
 * Default options for the component
 */
export const DEFAULT_CACHE_PLUGIN_OPTIONS: CachePluginComponentOptions = {
  cacheProvider: CacheStrategyTypes.Redis,
  prefix: 'sl',
  ttl: 60000,
};

export interface ICacheMixin<M extends Entity, ID> {
  getCacheDataSource: () => Promise<JugglerDataSource | SequelizeDataSource>;
  strategy: ICacheStrategy<M>;
  clearCache(): Promise<void>;
  generateKey(id?: ID, filter?: Filter<M>): Promise<string>;
}

export interface CacheEntity<M> {
  payload: M;
  insertionTime: number;
}
export type RedisConnectorExecuteReturnType = ArrayBuffer | Buffer | number;
export type SearchInCacheResponse<M> = M | M[] | undefined | null;
export type SaveInCacheValue<M> = M | M[] | null;
export type OptionsWithForceUpdate = Options & {forceUpdate?: boolean};

export type AbstractConstructor<T> = abstract new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[] // NOSONAR
) => T;

export type MixinBaseClass<T> = AbstractConstructor<T>;

export type CacheMixinBase<T extends Entity, ID, Relations> = MixinBaseClass<{
  entityClass: typeof Entity & {
    prototype: T;
  };
  find(filter?: Filter<T>, options?: Options): Promise<(T & Relations)[]>;
  findById(
    id: ID,
    filter?: FilterExcludingWhere<T>,
    options?: Options,
  ): Promise<T & Relations>;
  findOne(
    filter?: Filter<T>,
    options?: Options,
  ): Promise<(T & Relations) | null>;
}>;

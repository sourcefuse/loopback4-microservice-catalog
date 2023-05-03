// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, Filter, JugglerDataSource, Options} from '@loopback/repository';
import {ICacheStrategy} from './strategies';
import {CacheStrategyTypes} from './strategy-types.enum';

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
  getCacheDataSource: () => Promise<JugglerDataSource>;
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

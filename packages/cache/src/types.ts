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
  salt: string;
}

/**
 * Default options for the component
 */
export const DEFAULT_CACHE_PLUGIN_OPTIONS: CachePluginComponentOptions = {
  cacheProvider: CacheStrategyTypes.Redis,
  prefix: 'sl',
  salt: '$2b$10$Pdp69XWPJjQ8iFcum6GHEe', // For security, this should come from env or secrets manager
};

export interface ICacheMixin<M extends Entity, ID> {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  strategy: ICacheStrategy<M>;
  clearCache(): Promise<void>;
  generateKey(id?: ID, filter?: Filter<M>): Promise<string>;
}

export interface ICacheMixinOptions {
  ttl?: number;
}

export interface ICacheFindOptions {
  forceUpdate: boolean;
}

export type CacheOptions = Options & ICacheFindOptions;

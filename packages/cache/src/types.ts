import {Options} from '@loopback/repository';
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
  salt: '8m*b.p*x?9FJ', // For security, this should come from env or secrets manager
};

export interface CacheMixinOptions {
  ttl?: number;
}

export interface CacheFindOptions extends CacheMixinOptions {
  forceUpdate: boolean;
}

export type CacheOptions = Options & CacheFindOptions;

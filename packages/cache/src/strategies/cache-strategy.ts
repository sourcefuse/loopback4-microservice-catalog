import {JugglerDataSource} from '@loopback/repository';
import {CacheMixinOptions, CachePluginComponentOptions} from '../types';

export interface ICacheStrategy<M> extends CachePluginComponentOptions {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  searchInCache(
    key: string,
    cacheOptions: CacheMixinOptions,
  ): Promise<M | M[] | undefined>;
  saveInCache(
    key: string,
    value: M | M[],
    cacheOptions: CacheMixinOptions,
  ): Promise<void>;
  clearCache(cacheOptions: CacheMixinOptions): Promise<void>;
}

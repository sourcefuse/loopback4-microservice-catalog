import {JugglerDataSource} from '@loopback/repository';
import {CachePluginComponentOptions, ICacheMixinOptions} from '../types';

export interface ICacheStrategy<M> extends CachePluginComponentOptions {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  searchInCache(
    key: string,
    cacheOptions: ICacheMixinOptions,
  ): Promise<M | M[] | undefined>;
  saveInCache(
    key: string,
    value: M | M[],
    cacheOptions: ICacheMixinOptions,
  ): Promise<void>;
  clearCache(cacheOptions: ICacheMixinOptions): Promise<void>;
}

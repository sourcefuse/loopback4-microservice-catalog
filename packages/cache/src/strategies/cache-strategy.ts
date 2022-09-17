// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {JugglerDataSource} from '@loopback/repository';
import {CachePluginComponentOptions, ICacheMixinOptions} from '../types';

export interface ICacheStrategy<M> extends CachePluginComponentOptions {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  searchInCache(
    key: string,
    cacheOptions: ICacheMixinOptions,
  ): Promise<M | M[] | undefined | null>;
  saveInCache(
    key: string,
    value: M | M[] | null,
    cacheOptions: ICacheMixinOptions,
  ): Promise<void>;
  clearCache(cacheOptions: ICacheMixinOptions): Promise<void>;
}

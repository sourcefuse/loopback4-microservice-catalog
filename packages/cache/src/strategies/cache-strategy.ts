// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {JugglerDataSource} from '@loopback/repository';
import {CachePluginComponentOptions} from '../types';
import {SequelizeDataSource} from '@loopback/sequelize';

export interface ICacheStrategy<M> extends CachePluginComponentOptions {
  getCacheDataSource: () => Promise<JugglerDataSource | SequelizeDataSource>;
  searchInCache(key: string): Promise<M | M[] | undefined | null>;
  saveInCache(key: string, value: M | M[] | null): Promise<void>;
  clearCache(): Promise<void>;
}

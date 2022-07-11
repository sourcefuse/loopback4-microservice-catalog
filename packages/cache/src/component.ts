// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Application,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {CachePluginComponentBindings} from './keys';
import {CacheManager} from './mixins';
import {
  CachePluginComponentOptions,
  DEFAULT_CACHE_PLUGIN_OPTIONS,
} from './types';

// Configure the binding for CachePluginComponent
@injectable({tags: {[ContextTags.KEY]: CachePluginComponentBindings.COMPONENT}})
export class CachePluginComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: Application,
    @config()
    private readonly options: CachePluginComponentOptions = DEFAULT_CACHE_PLUGIN_OPTIONS,
  ) {
    CacheManager.options = options;
  }
}

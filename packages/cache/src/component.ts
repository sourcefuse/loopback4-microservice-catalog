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
    private application: Application,
    @config()
    private options: CachePluginComponentOptions = DEFAULT_CACHE_PLUGIN_OPTIONS,
  ) {
    CacheManager.options = options;
  }
}

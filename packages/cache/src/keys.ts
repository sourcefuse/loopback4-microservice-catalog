import {BindingKey, CoreBindings} from '@loopback/core';
import {CachePluginComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace CachePluginComponentBindings {
  export const COMPONENT = BindingKey.create<CachePluginComponent>(
    `${CoreBindings.COMPONENTS}.sf.CachePluginComponent`,
  );
}

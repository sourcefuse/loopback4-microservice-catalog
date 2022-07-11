// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, CoreBindings} from '@loopback/core';
import {UserTenantServiceComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace UserTenantServiceComponentBindings {
  export const COMPONENT = BindingKey.create<UserTenantServiceComponent>(
    `${CoreBindings.COMPONENTS}.UserTenantServiceComponent`,
  );
}

export const UserTenantDataSourceName = 'AuthDB';
export const UserTenantCacheSourceName = 'AuthCache';

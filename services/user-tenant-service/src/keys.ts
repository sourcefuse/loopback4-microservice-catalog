// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, CoreBindings, Interceptor} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {UserTenantServiceComponent} from './component';
import {IUserServiceConfig} from './types';

/**
 * Binding keys used by this component.
 */
export namespace UserTenantServiceComponentBindings {
  export const COMPONENT = BindingKey.create<UserTenantServiceComponent>(
    `${CoreBindings.COMPONENTS}.UserTenantServiceComponent`,
  );

  export const Config = BindingKey.create<IUserServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
}
export const UserTenantDataSourceName = 'AuthDB';
export const UserTenantCacheSourceName = 'AuthCache';

export namespace UserTenantServiceKey {
  export const UserGroupService = 'services.UserGroupService';
  export const UserOperationsService = 'services.UserOperationsService';
  export const TenantOperationsService = 'services.TenantOperationsService';
  export const GroupTenantInterceptor = 'interceptors.GroupTenantInterceptor';
  export const TenantInterceptorInterceptor =
    'interceptors.TenantInterceptorInterceptor';
  export const UserTenantInterceptorInterceptor =
    'interceptors.UserTenantInterceptorInterceptor';
}

/**
 * Binding key for the webhook verifier.
 */
export const USER_CALLBACK = BindingKey.create<Interceptor>(
  'sf.user-callback.verifier',
);

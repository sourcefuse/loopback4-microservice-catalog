import {BindingKey, CoreBindings} from '@loopback/core';
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
  export const GroupTenantInterceptor = 'interceptors.GroupTenantInterceptor';
  export const TenantInterceptorInterceptor =
    'interceptors.TenantInterceptorInterceptor';
  export const UserTenantInterceptorInterceptor =
    'interceptors.UserTenantInterceptorInterceptor';
}

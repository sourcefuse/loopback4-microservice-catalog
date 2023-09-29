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

export namespace UserTenantServiceKey{
  export const  UserGroupService='services.UserGroupService';
  export const UserOperationsService='services.UserOperationsService';
  export const GroupTenantInterceptor='interceptors.GroupTenantInterceptor';
  export const TenantInterceptorInterceptor='interceptors.TenantInterceptorInterceptor';
  export const UserTenantInterceptorInterceptor='interceptors.UserTenantInterceptorInterceptor';
}



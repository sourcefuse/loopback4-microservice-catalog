import {BindingKey} from '@loopback/core';
import {TenantUtilitiesComponent} from './component';
import {EntityWithTenantId, ITenantGuard} from './types';

export const TenantUtilitiesNamespace = 'sourceloop.tenant.utilities';
export namespace TenantUtilitiesBindings {
  export const Component = BindingKey.create<TenantUtilitiesComponent>(
    `${TenantUtilitiesNamespace}.TenantUtilitiesComponent`,
  );
  export const GuardService = BindingKey.create<
    ITenantGuard<EntityWithTenantId, string | number>
  >(`${TenantUtilitiesNamespace}.TenantGuardService`);
}

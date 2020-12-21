import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface IAuthUserWithPerms extends IAuthUserWithPermissions {
  tenantId: string;
  userTenantId?: string;
}

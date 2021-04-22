import {RoleTypes} from '@sourceloop/core';
import {IAuthUser} from 'loopback4-authentication';

export interface UserWithPermissions<ID = string, TID = string, UTID = string>
  extends IAuthUser {
  id?: string;
  identifier?: ID;
  permissions: string[];
  authClientId: number;
  email?: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  tenantId?: TID;
  userTenantId?: UTID;
  passwordExpiryTime?: Date;
}

export interface RoleTypeMapValue {
  permissionKey: string;
  value: number;
}

export const RoleTypeMap: {
  [key in RoleTypes]: RoleTypeMapValue;
} = {
  [RoleTypes.Admin]: {
    permissionKey: 'PlatformAdmin',
    value: RoleTypes.Admin,
  },
  [RoleTypes.Others]: {
    permissionKey: 'Others',
    value: RoleTypes.Others,
  },
};

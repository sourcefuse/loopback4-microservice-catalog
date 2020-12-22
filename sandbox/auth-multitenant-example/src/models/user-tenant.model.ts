import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {BaseEntity, IUserPrefs, UserStatus} from '@sourceloop/core';

import {
  Role,
  Tenant,
  TenantWithRelations,
  User,
  UserLevelPermission,
  UserWithRelations,
} from './';

@model({
  name: 'user_tenants',
})
export class UserTenant extends BaseEntity implements IUserPrefs {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  locale?: string;

  @property({
    type: 'number',
    jsonSchema: {
      maximum: 12,
      minimum: 0,
    },
  })
  status?: UserStatus;

  @belongsTo(
    () => User,
    {name: 'user'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: string;

  @belongsTo(
    () => Tenant,
    {name: 'tenant'},
    {
      name: 'tenant_id',
      required: true,
    },
  )
  tenantId: string;

  @belongsTo(
    () => Role,
    {name: 'role'},
    {
      name: 'role_id',
      required: true,
    },
  )
  roleId: string;

  @hasMany(() => UserLevelPermission, {keyTo: 'userTenantId'})
  userLevelPermissions: UserLevelPermission[];

  constructor(data?: Partial<UserTenant>) {
    super(data);
  }
}

export interface UserTenantRelations {
  user: UserWithRelations;
  tenant: TenantWithRelations;
  role: Role;
}

export type UserTenantWithRelations = UserTenant & UserTenantRelations;

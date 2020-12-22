import {hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

import {UserTenant, UserTenantRelations} from './user-tenant.model';

@model({
  name: 'roles',
})
export class Role extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
    name: 'role_type',
    jsonSchema: {
      maximum: 11,
      minimum: 0,
    },
  })
  roleType: number;

  @property({
    type: 'string',
  })
  permissions?: string;

  @property({
    name: 'allowed_clients',
    type: 'string',
  })
  allowedClients?: string;

  @hasMany(() => UserTenant, {keyTo: 'roleId'})
  userTenants: UserTenant[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  userTenants: UserTenantRelations[];
}

export type RoleWithRelations = Role & RoleRelations;

import {hasMany, model, property, hasOne} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {RoleType} from '../enums';

import {UserTenant, UserTenantRelations} from './user-tenant.model';
import {UserView} from './user-view.model';

@model({
  name: 'roles',
  settings: {
    defaultIdSort: false,
  },
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
  roleType: RoleType;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions?: string[];

  @property({
    name: 'allowed_clients',
    type: 'array',
    itemType: 'string',
  })
  allowedClients?: string[];

  @hasMany(() => UserTenant, {keyTo: 'roleId'})
  userTenants: UserTenant[];

  @hasOne(() => UserView, {keyFrom: 'createdBy', keyTo: 'id'})
  createdByUser?: UserView;

  @hasOne(() => UserView, {keyFrom: 'modifiedBy', keyTo: 'id'})
  modifiedByUser?: UserView;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  userTenants: UserTenantRelations[];
}

export type RoleWithRelations = Role & RoleRelations;

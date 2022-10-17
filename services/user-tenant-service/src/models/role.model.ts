// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property, hasOne} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {RoleType} from '../enums';

import {UserTenant, UserTenantRelations} from './user-tenant.model';
import {UserView} from './user-view.model';

@model({
  name: 'roles',
})
export class Role extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
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
      maximum: 15,
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

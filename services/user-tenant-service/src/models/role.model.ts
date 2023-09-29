// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { hasMany, model, property, hasOne} from '@loopback/repository';
import { UserModifiableEntity } from '@sourceloop/core';

import { UserTenant, UserTenantRelations } from './user-tenant.model';
import {UserView} from './user-view.model';

@model({
  name: 'roles',
})
export class Role extends UserModifiableEntity<Role> {
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
    name: 'role_type',
    jsonSchema: {
      maximum: 15,
      minimum: 0,
    },
  })
  roleType?: number;

  @property({
    type: 'string'
  })
  description?: string;

  
  @property({
  
    type: 'array',
    itemType: 'string',
    postgresql:{
      dataType:'varchar[]'
    }
  })
  permissions?: string[];

  @property({
    name: 'allowed_clients',
    type: 'array',
    itemType: 'string',
    postgresql:{
      dataType:'varchar[]'
    }
  })
  allowedClients?: string[];


  @property({
    type: 'string',
    name:'tenant_id',
    required:true
  })
  tenantId: string;

  @hasMany(() => UserTenant, {keyTo: 'roleId'})
  userTenants: UserTenant[];

  @hasOne(() => UserView, {keyFrom: 'createdBy', keyTo: 'id'})
  createdByUser?: UserView;

  @hasOne(() => UserView, {keyFrom: 'modifiedBy', keyTo: 'id'})
  modifiedByUser?: UserView;

}

export interface RoleRelations {
  userTenants: UserTenantRelations[];
}

export type RoleWithRelations = Role & RoleRelations;

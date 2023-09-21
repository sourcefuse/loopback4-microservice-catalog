// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property} from '@loopback/repository';
import {TenantStatus, UserModifiableEntity} from '@sourceloop/core';

import {
  TenantConfig,
  TenantConfigWithRelations,
  UserTenant,
  UserTenantWithRelations,
} from '../models';
import {User} from './user.model';

@model({
  name: 'tenants',
  description: 'signature for all tenants',
})
export class Tenant extends UserModifiableEntity<Tenant> {
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
    description: 'Tenant status - Active or Inactive',
    jsonSchema: {
      enum: [TenantStatus.ACTIVE, TenantStatus.INACTIVE],
      nullable: true,
    },
  })
  status: TenantStatus;

  @property({
    type: 'string',
  })
  key?: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  zip?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @hasMany(() => TenantConfig,{keyTo: 'tenantId'})
  tenantConfigs: TenantConfig[];

  @hasMany(() => UserTenant,{keyTo: 'tenantId'})
  userTenants: UserTenant[];

  @hasMany(() => User, {keyTo: 'defaultTenantId'})
  users: User[];
}

export interface TenantRelations {
  tenantConfigs: TenantConfigWithRelations[];
  userTenants: UserTenantWithRelations[];
}

export type TenantWithRelations = Tenant & TenantRelations;

import {hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

import {UserTenant, UserTenantWithRelations} from '../models';

@model({
  name: 'tenants',
  description: 'signature for all tenants',
})
export class Tenant extends UserModifiableEntity {
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
    description: 'Tenant status - Active or Inactive',
    jsonSchema: {
      enum: [1, 0],
      nullable: true,
    },
  })
  status: number;

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

  @hasMany(() => UserTenant, {keyTo: 'tenantId'})
  userTenants: UserTenant[];

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  userTenants: UserTenantWithRelations[];
}

export type TenantWithRelations = Tenant & TenantRelations;

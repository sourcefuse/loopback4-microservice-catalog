import {model, property, hasMany} from '@loopback/repository';

import {UserModifiableEntity, TenantStatus} from '@sourceloop/core';
import {TenantConfig} from './tenant-config.model';

@model({
  name: 'tenants',
})
export class Tenant extends UserModifiableEntity {
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
    type: 'string',
    required: true,
  })
  key: string;

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

  @property({
    type: 'number',
    required: true,
    description: 'Tenant status - Active or Inactive',
    jsonSchema: {
      enum: [TenantStatus.ACTIVE, TenantStatus.INACTIVE],
    },
  })
  status: TenantStatus;

  @hasMany(() => TenantConfig, {keyTo: 'tenantId'})
  tenantConfigs: TenantConfig[];

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export type TenantWithRelations = Tenant;

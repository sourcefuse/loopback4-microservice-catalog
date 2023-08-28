// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property} from '@loopback/repository';

import {TenantStatus, UserModifiableEntity} from '@sourceloop/core';
import {TenantConfig} from './tenant-config.model';

@model({
  name: 'tenants',
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
}

export type TenantWithRelations = Tenant;

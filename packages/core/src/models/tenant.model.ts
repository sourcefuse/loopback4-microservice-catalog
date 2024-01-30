// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, hasMany, model, property} from '@loopback/repository';

import {TenantConfig, TenantConfigWithRelations} from '.';
import {TenantStatus} from '../enums';

@model({
  name: 'tenants',
  description: 'signature for all tenants',
})
export class Tenant extends Entity {
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

  @hasMany(() => TenantConfig, {keyTo: 'tenantId'})
  tenantConfigs: TenantConfig[];
}

export interface TenantRelations {
  tenantConfigs: TenantConfigWithRelations[];
}

export type TenantWithRelations = Tenant & TenantRelations;

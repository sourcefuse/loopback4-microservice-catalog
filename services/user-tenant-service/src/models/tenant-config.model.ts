// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity, ConfigKey} from '@sourceloop/core';
import {Tenant, TenantWithRelations} from './index';

@model({
  name: 'tenant_configs',
})
export class TenantConfig extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'config_key',
  })
  configKey: ConfigKey;

  @property({
    type: 'object',
    name: 'config_value',
  })
  configValue?: object;

  @belongsTo(
    () => Tenant,
    {keyFrom: 'tenant_id', name: 'tenant'},
    {
      name: 'tenant_id',
      required: true,
    },
  )
  tenantId: string;

  constructor(data?: Partial<TenantConfig>) {
    super(data);
  }
}

export interface TenantConfigRelations {
  tenant: TenantWithRelations;
}

export type TenantConfigWithRelations = TenantConfig & TenantConfigRelations;

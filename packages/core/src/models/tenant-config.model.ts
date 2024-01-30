// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';
import {ConfigKey} from '../enums';
import {TenantWithRelations} from '../models';
@model({
  name: 'tenant_configs',
})
export class TenantConfig extends Entity {
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

  @property({
    type: 'string',
    name: 'tenant_id',
    required: true,
  })
  tenantId: string;
}

export interface TenantConfigRelations {
  tenant: TenantWithRelations;
}

export type TenantConfigWithRelations = TenantConfig & TenantConfigRelations;

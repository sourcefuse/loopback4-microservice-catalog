// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, model, property} from '@loopback/repository';
import {ConfigKey, UserModifiableEntity} from '@sourceloop/core';
import {Tenant} from './tenant.model';

@model({
  name: 'tenant_configs',
})
export class TenantConfig extends UserModifiableEntity<TenantConfig> {
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
}

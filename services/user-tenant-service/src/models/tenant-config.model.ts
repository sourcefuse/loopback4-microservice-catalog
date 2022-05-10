import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity, ConfigKey} from '@sourceloop/core';
import {Tenant, TenantWithRelations} from './index';

@model({
  name: 'tenant_configs',
  settings: {
    defaultIdSort: false,
  },
})
export class TenantConfig extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
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
    {name: 'tenant'},
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

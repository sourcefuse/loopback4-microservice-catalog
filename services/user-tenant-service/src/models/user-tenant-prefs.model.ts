// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {UserConfigKey} from '../enums';
import {UserTenant} from './user-tenant.model';

@model({
  name: 'user_tenant_prefs',
  settings: {
    defaultIdSort: false,
  },
})
export class UserTenantPrefs extends UserModifiableEntity {
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
  configKey: UserConfigKey;

  @property({
    type: 'object',
    required: true,
    name: 'config_value',
  })
  configValue?: object;

  @belongsTo(
    () => UserTenant,
    {keyFrom: 'user_tenant_id'},
    {
      name: 'user_tenant_id',
      required: false,
    },
  )
  userTenantId: string;

  constructor(data?: Partial<UserTenantPrefs>) {
    super(data);
  }
}

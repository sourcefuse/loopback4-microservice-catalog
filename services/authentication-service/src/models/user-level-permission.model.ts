// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {UserPermission} from 'loopback4-authorization';
import {UserTenant} from './user-tenant.model';

@model({
  name: 'user_permissions',
})
export class UserLevelPermission
  extends UserModifiableEntity<UserLevelPermission>
  implements UserPermission<string>
{
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @belongsTo(
    () => UserTenant,
    {keyFrom: 'user_tenant_id', name: 'userTenant'},
    {
      name: 'user_tenant_id',
      required: true,
    },
  )
  userTenantId: string;

  @property({
    type: 'string',
    required: true,
  })
  permission: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  allowed: boolean;
}

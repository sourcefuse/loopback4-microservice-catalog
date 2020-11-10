import {belongsTo, model, property} from '@loopback/repository';
import {UserPermission, UserResource} from 'loopback4-authorization';
import {UserModifiableEntity} from '@sourceloop/core';

import {UserTenant} from './user-tenant.model';

@model({
  name: 'user_resources',
})
export class UserLevelResource extends UserModifiableEntity {
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
  resourceName: string;

  @property({
    type: 'string',
    required: true,
  })
  resourceValue: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  allowed: boolean;

  constructor(data?: Partial<UserLevelResource>) {
    super(data);
  }
}

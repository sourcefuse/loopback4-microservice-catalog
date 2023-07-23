// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {User} from './user.model';

@model()
export class UserDto extends CoreModel<UserDto> {
  @property({
    type: 'string',
    required: true,
  })
  roleId: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantId: string;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    name: 'auth_provider',
    type: 'string',
  })
  authProvider?: string;

  @property({
    name: 'auth_id',
    type: 'string',
  })
  authId?: string;

  @property({
    name: 'user_tenant_id',
    type: 'string',
    required: false,
  })
  userTenantId: string;

  @property(() => User)
  userDetails: User;
}

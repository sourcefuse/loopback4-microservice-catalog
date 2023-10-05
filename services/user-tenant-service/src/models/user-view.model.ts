// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject, Model, model, property} from '@loopback/repository';
import {Gender, UserModifiableEntity, UserStatus} from '@sourceloop/core';

@model({
  name: 'v_users',
  description: 'User details view in DB',
  settings: {
    defaultIdSort: false,
  },
})
export class UserView<T = DataObject<Model>> extends UserModifiableEntity<
  T & UserView
> {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  designation?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
    name: 'auth_client_ids',
  })
  authClientIds: string;

  @property({
    name: 'last_login',
    type: 'string',
  })
  lastLogin?: string;

  @property({
    name: 'photo_url',
    type: 'string',
  })
  photoUrl?: string;

  @property({
    type: 'string',
    description: `This field takes a single character as input in database.
    'M' for male and 'F' for female.`,
    jsonSchema: {
      enum: ['M', 'F', 'O'],
    },
  })
  gender?: Gender;

  @property({
    type: 'date',
    jsonSchema: {
      nullable: true,
    },
  })
  dob?: Date;

  @property({
    type: 'string',
    name: 'default_tenant_id',
    required: true,
  })
  defaultTenantId: string;

  @property({
    type: 'number',
    jsonSchema: {
      maximum: 11,
      minimum: 0,
    },
  })
  status?: UserStatus;

  @property({
    type: 'string',
    name: 'tenant_id',
    required: true,
  })
  tenantId: string;

  @property({
    type: 'string',
    name: 'role_id',
    required: true,
  })
  roleId: string;

  @property({
    name: 'name',
    type: 'string',
    required: true,
  })
  tenantName: string;

  @property({
    name: 'key',
    type: 'string',
  })
  tenantKey?: string;

  @property({
    name: 'rolename',
    type: 'string',
  })
  roleName?: string;

  @property({
    name: 'user_tenant_id',
    type: 'string',
    required: true,
  })
  userTenantId: string;
}

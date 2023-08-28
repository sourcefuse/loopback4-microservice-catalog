// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {RoleTypes, UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'roles',
})
export class Role extends UserModifiableEntity<Role> {
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
    name: 'role_type',
    jsonSchema: {
      maximum: 15,
      minimum: 0,
    },
  })
  roleType: RoleTypes;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];
}
export type RoleWithRelations = Role;

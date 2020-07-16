import {model, property} from '@loopback/repository';
import {UserModifiableEntity, RoleTypes} from '@sourceloop/core';

@model({
  name: 'roles',
})
export class Role extends UserModifiableEntity {
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
      minimum: 1,
    },
  })
  roleType: RoleTypes;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}
export type RoleWithRelations = Role;

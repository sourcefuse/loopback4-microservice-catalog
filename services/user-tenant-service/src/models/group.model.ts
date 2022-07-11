// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {UserTenantGroupType} from '../enums';
import {hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {UserGroup, UserGroupWithRelations} from './user-group.model';
@model({
  name: 'groups',
  settings: {
    defaultIdSort: false,
  },
})
export class Group extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    name: 'photo_url',
    type: 'string',
    required: false,
  })
  photoUrl?: string;

  @property({
    name: 'group_type',
    jsonSchema: {
      enum: Object.values(UserTenantGroupType),
    },
    default: UserTenantGroupType.Tenant,
  })
  groupType?: UserTenantGroupType;

  @hasMany(() => UserGroup, {keyTo: 'groupId'})
  userGroups: UserGroup[];

  constructor(data?: Partial<Group>) {
    super(data);
  }
}

export interface GroupRelations {
  userGroups: UserGroupWithRelations;
}

export type GroupWithRelations = Group & GroupRelations;

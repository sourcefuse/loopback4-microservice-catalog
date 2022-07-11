// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Group, GroupWithRelations} from './group.model';
import {UserTenant, UserTenantWithRelations} from './user-tenant.model';

@model({
  name: 'user_groups',
  settings: {
    defaultIdSort: false,
  },
})
export class UserGroup extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @belongsTo(
    () => Group,
    {name: 'group'},
    {
      name: 'group_id',
      required: true,
    },
  )
  groupId: string;

  @belongsTo(
    () => UserTenant,
    {name: 'userTenant'},
    {
      name: 'user_tenant_id',
      required: true,
    },
  )
  userTenantId: string;

  @property({
    name: 'is_owner',
    type: 'boolean',
    default: false,
  })
  isOwner?: boolean;

  constructor(data?: Partial<UserGroup>) {
    super(data);
  }
}

export interface UserGroupRelations {
  group: GroupWithRelations;
  userTenant: UserTenantWithRelations;
}

export type UserGroupWithRelations = UserGroup & UserGroupRelations;

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey, RoleTypeValue} from './enums';

export const userGroupOwnerPerms = [
  PermissionKey.AddMemberToUserGroup,
  PermissionKey.UpdateMemberInUserGroup,
  PermissionKey.RemoveMemberFromUserGroup,
  PermissionKey.UpdateUserGroup,
  PermissionKey.DeleteUserGroup,
];

export const RoleNames: {
  [key in RoleTypeValue]: string;
} = {
  [RoleTypeValue.SuperAdmin]: 'SuperAdmin',
  [RoleTypeValue.TenantAdmin]: 'TenantAdmin',
};
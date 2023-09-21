// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { RoleTypes } from '@sourceloop/core';

export const enum RoleKey {
  Admin = 0,
  Default = 2
}
export type RoleType = RoleKey & RoleTypes;

export const DisallowedRoles = [RoleTypes.Others];

export interface RoleTypeMapValue {
  permissionKey: string;
  value: number;
}
export const RoleTypeMap: {
  [key in keyof RoleType]: RoleTypeMapValue;
} = {
  [RoleTypes.Admin]: {
    permissionKey: 'Admin',
    value: RoleTypes.Admin,
  },
  [RoleKey.Default]: {
    permissionKey: 'Default',
    value: RoleKey.Default,
  }
};

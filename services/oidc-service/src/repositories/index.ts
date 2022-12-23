// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {OtpRepository} from './otp.repository';
import {RoleRepository} from './role.repository';
import {TenantConfigRepository} from './tenant-config.repository';
import {TenantRepository} from './tenant.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserLevelPermissionRepository} from './user-level-permission.repository';
import {UserTenantRepository} from './user-tenant.repository';
import {UserRepository} from './user.repository';

export * from './user.repository';
export * from './role.repository';
export * from './user-level-permission.repository';
export * from './user-credentials.repository';
export * from './otp.repository';
export * from './tenant-config.repository';
export * from './user-tenant.repository';
export * from './tenant.repository';

export const repositories = [
  UserRepository,
  RoleRepository,
  UserLevelPermissionRepository,
  UserCredentialsRepository,
  OtpRepository,
  TenantConfigRepository,
  UserTenantRepository,
  TenantRepository,
];

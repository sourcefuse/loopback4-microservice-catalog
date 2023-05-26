// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {Tenant} from './tenant.model';
import {UserCredentials} from './user-credentials.model';

import {UserTenant} from './user-tenant.model';
import {User} from './user.model';
import {AuthClient} from './auth-client.model';
import {Role} from './role.model';
import {TenantConfig} from './tenant-config.model';
import {UserLevelPermission} from './user-level-permission.model';
import {Otp} from './otp.model';

export * from './tenant.model';
export * from './user-credentials.model';
export * from './user-tenant.model';
export * from './user.model';
export * from './auth-client.model';
export * from './role.model';
export * from './tenant-config.model';
export * from './user-level-permission.model';
export * from './otp.model';

export const models = [
  User,
  Tenant,
  UserCredentials,
  UserTenant,
  AuthClient,
  Role,
  TenantConfig,
  UserLevelPermission,
  Otp,
];

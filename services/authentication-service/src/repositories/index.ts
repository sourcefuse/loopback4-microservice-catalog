import {AuthClientRepository} from './auth-client.repository';
import {OtpRepository} from './otp.repository';
import {RefreshTokenRepository} from './refresh-token.repository';
import {RevokedTokenRepository} from './revoked-token.repository';
import {RoleRepository} from './role.repository';
import {TenantConfigRepository} from './tenant-config.repository';
import {TenantRepository} from './tenant.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserLevelPermissionRepository} from './user-level-permission.repository';
import {UserLevelResourceRepository} from './user-level-resource.repository';
import {UserTenantRepository} from './user-tenant.repository';
import {UserRepository} from './user.repository';

export * from './user.repository';
export * from './role.repository';
export * from './user-level-permission.repository';
export * from './user-level-resource.repository';
export * from './refresh-token.repository';
export * from './auth-client.repository';
export * from './revoked-token.repository';
export * from './user-credentials.repository';
export * from './otp.repository';
export * from './tenant-config.repository';
export * from './user-tenant.repository';
export * from './tenant.repository';

export const repositories = [
  UserRepository,
  RoleRepository,
  UserLevelPermissionRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  AuthClientRepository,
  UserCredentialsRepository,
  OtpRepository,
  TenantConfigRepository,
  UserTenantRepository,
  TenantRepository,
  UserLevelResourceRepository,
];

import {User} from './user.model';
import {Tenant} from './tenant.model';
import {Role} from './role.model';
import {AuthClient} from './auth-client.model';
import {UserLevelPermission} from './user-level-permission.model';
import {RefreshToken} from './refresh-token.model';
import {RevokedToken} from './revoked-token.model';
import {UserCredentials} from './user-credentials.model';
import {Otp} from './otp.model';
import {TenantConfig} from './tenant-config.model';
import {UserTenant} from './user-tenant.model';
import {RefreshTokenRequest} from './refresh-token-request.model';
import {ForgetPasswordResponseDto} from './forget-password-response-dto.model';
import {ForgetPasswordDto} from './forget-password-dto.model';
import {ResetPasswordWithClient} from './reset-password-with-client.model';
import {UserLevelResource} from './user-level-resource.model';

export * from './user.model';
export * from './tenant.model';
export * from './role.model';
export * from './user-level-resource.model';
export * from './user-level-permission.model';
export * from './auth-client.model';
export * from './refresh-token.model';
export * from './revoked-token.model';
export * from './user-credentials.model';
export * from './otp.model';
export * from './tenant-config.model';
export * from './user-tenant.model';
export * from './refresh-token-request.model';
export * from './forget-password-response-dto.model';
export * from './forget-password-dto.model';
export * from './reset-password-with-client.model';
export * from './';

export const models = [
  User,
  Tenant,
  Role,
  AuthClient,
  UserLevelPermission,
  UserLevelResource,
  RefreshToken,
  RevokedToken,
  UserCredentials,
  Otp,
  TenantConfig,
  UserTenant,
  RefreshTokenRequest,
  ForgetPasswordResponseDto,
  ForgetPasswordDto,
  ResetPasswordWithClient,
];

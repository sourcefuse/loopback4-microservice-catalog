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
import {SignupRequestDto} from './signup-request-dto.model';
import {SignupRequestResponseDto} from './signup-request-response-dto.model';
import {SignupRequest} from './signup-request.model';
import {SignupWithTokenReponseDto} from './signup-with-token-response-dto.model';
import {LocalUserProfileDto} from './local-user-profile';

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
export * from './signup-request-response-dto.model';
export * from './signup-request.model';
export * from './signup-with-token-response-dto.model';
export * from './signup-request-dto.model';
export * from './local-user-profile';
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
  SignupRequestDto,
  SignupRequestResponseDto,
  SignupRequest,
  SignupWithTokenReponseDto,
  LocalUserProfileDto,
];

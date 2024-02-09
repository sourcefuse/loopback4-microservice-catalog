// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AuthClient} from './auth-client.model';
import {AuthSecureClient} from './auth-secure-client.model';
import {ForgetPasswordDto} from './forget-password-dto.model';
import {ForgetPasswordResponseDto} from './forget-password-response-dto.model';
import {LocalUserProfileDto} from './local-user-profile';
import {LoginActivity} from './login-activity.model';
import {OtpCache} from './otp-cache.model';
import {Otp} from './otp.model';
import {RefreshTokenRequest} from './refresh-token-request.model';
import {RefreshToken} from './refresh-token.model';
import {ResetPasswordWithClient} from './reset-password-with-client.model';
import {RevokedToken} from './revoked-token.model';
import {Role} from './role.model';
import {SignupRequestDto} from './signup-request-dto.model';
import {SignupRequestResponseDto} from './signup-request-response-dto.model';
import {SignupRequest} from './signup-request.model';
import {SignupWithTokenReponseDto} from './signup-with-token-response-dto.model';
import {TenantConfig} from './tenant-config.model';
import {Tenant} from './tenant.model';
import {UserCredentials} from './user-credentials.model';
import {UserLevelPermission} from './user-level-permission.model';
import {UserLevelResource} from './user-level-resource.model';
import {UserTenant} from './user-tenant.model';
import {User} from './user.model';

export * from './';
export * from './auth-client.model';
export * from './auth-secure-client.model';
export * from './forget-password-dto.model';
export * from './forget-password-response-dto.model';
export * from './local-user-profile';
export * from './otp-cache.model';
export * from './otp.model';
export * from './refresh-token-request.model';
export * from './refresh-token.model';
export * from './reset-password-with-client.model';
export * from './revoked-token.model';
export * from './role.model';
export * from './signup-request-dto.model';
export * from './signup-request-response-dto.model';
export * from './signup-request.model';
export * from './signup-with-token-response-dto.model';
export * from './tenant-config.model';
export * from './tenant.model';
export * from './user-credentials.model';
export * from './user-level-permission.model';
export * from './user-level-resource.model';
export * from './user-tenant.model';
export * from './user.model';
export * from './login-activity.model';

export const models = [
  User,
  Tenant,
  Role,
  AuthClient,
  AuthSecureClient,
  UserLevelPermission,
  UserLevelResource,
  RefreshToken,
  RevokedToken,
  UserCredentials,
  Otp,
  OtpCache,
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
  LoginActivity,
];

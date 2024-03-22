// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  ForgotPasswordHandlerFn,
  JwtPayloadFn,
  PasswordDecryptionFn,
  PasswordHashingFn,
  PasswordVerifyFn,
} from './providers';
import {
  ActorId,
  IAuthServiceConfig,
  IMfaConfig,
  IOtpConfig,
  IUserActivity,
  UserValidationFn,
} from './types';

export namespace AuthServiceBindings {
  export const Config = BindingKey.create<IAuthServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
  export namespace UserValidationServiceBindings {
    export const VALIDATE_USER = BindingKey.create<UserValidationFn | null>(
      `${BINDING_PREFIX}.auth.validateUser`,
    );
  }
  export const MfaConfig = BindingKey.create<IMfaConfig | null>(
    `${BINDING_PREFIX}.auth.mfa.config`,
  );

  export const OtpConfig = BindingKey.create<IOtpConfig | null>(
    `${BINDING_PREFIX}.auth.mfa.otp.config`,
  );

  export const JWTPayloadProvider = BindingKey.create<JwtPayloadFn>(
    `${BINDING_PREFIX}.auth.jwt.payload`,
  );
  export const PASSWORD_DECRYPTION_PROVIDER =
    BindingKey.create<PasswordDecryptionFn>(
      `sf.auth.password.decryption.provider`,
    );
  export const PASSWORD_HASHING_PROVIDER = BindingKey.create<PasswordHashingFn>(
    `sf.auth.password.hashing.provider`,
  );
  export const PASSWORD_VERIFY_PROVIDER = BindingKey.create<PasswordVerifyFn>(
    `sf.auth.password.verify.provider`,
  );
  export const ForgotPasswordHandler =
    BindingKey.create<ForgotPasswordHandlerFn>(
      `${BINDING_PREFIX}.forgetpassword.handler.provider`,
    );

  export const ActorIdKey = BindingKey.create<ActorId>(
    `${BINDING_PREFIX}.active.users.actorid`,
  );

  export const MarkUserActivity = BindingKey.create<IUserActivity>(
    `${BINDING_PREFIX}.mark.users.activity`,
  );
}

export {AuthenticationBindings} from 'loopback4-authentication';
export {AuthorizationBindings} from 'loopback4-authorization';

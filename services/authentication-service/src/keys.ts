// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {ForgotPasswordHandlerFn, JwtPayloadFn} from './providers';
import {
  ActorId,
  IAuthServiceConfig,
  IMfaConfig,
  IOtpConfig,
  IUserActivity,
} from './types';

export namespace AuthServiceBindings {
  export const Config = BindingKey.create<IAuthServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );

  export const MfaConfig = BindingKey.create<IMfaConfig | null>(
    `${BINDING_PREFIX}.auth.mfa.config`,
  );

  export const OtpConfig = BindingKey.create<IOtpConfig | null>(
    `${BINDING_PREFIX}.auth.mfa.otp.config`,
  );

  export const JWTPayloadProvider = BindingKey.create<JwtPayloadFn>(
    `${BINDING_PREFIX}.auth.jwt.payload`,
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

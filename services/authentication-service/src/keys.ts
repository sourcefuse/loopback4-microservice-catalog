// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {ForgotPasswordHandlerFn, JwtPayloadFn} from './providers';
import {IAuthServiceConfig, IMfaConfig, IOtpConfig} from './types';

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
}

export {AuthenticationBindings} from 'loopback4-authentication';

export {AuthorizationBindings} from 'loopback4-authorization';

import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {JwtPayloadFn} from './providers';
import {IAuthServiceConfig} from './types';

export namespace AuthServiceBindings {
  export const Config = BindingKey.create<IAuthServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );

  export const JWTPayloadProvider = BindingKey.create<JwtPayloadFn>(
    `${BINDING_PREFIX}.auth.jwt.payload`,
  );
}

export {AuthenticationBindings} from 'loopback4-authentication';

export {AuthorizationBindings} from 'loopback4-authorization';

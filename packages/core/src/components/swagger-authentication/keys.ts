import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '../../constants';
import {HttpAuthenticationVerifier} from './types';
export namespace SwaggerAuthenticationBindings {
  export const VERIFIER = BindingKey.create<HttpAuthenticationVerifier>(
    `${BINDING_PREFIX}.bearer-verfier.config`,
  );
}

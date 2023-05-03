// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '../../constants';
import {HttpAuthenticationVerifier} from './types';
export namespace SwaggerAuthenticationBindings {
  export const VERIFIER = BindingKey.create<HttpAuthenticationVerifier>(
    `${BINDING_PREFIX}.swagger-auth.verifier`,
  );
}

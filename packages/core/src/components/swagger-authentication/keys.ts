// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '../../constants';
import {HttpAuthenticationVerifier} from './types';
/**
 * Creating a namespace called `SwaggerAuthenticationBindings`
 * Creating a constant called `VERIFIER.`
 */
export namespace SwaggerAuthenticationBindings {
  export const VERIFIER = BindingKey.create<HttpAuthenticationVerifier>(
    `${BINDING_PREFIX}.swagger-auth.verifier`,
  );
}

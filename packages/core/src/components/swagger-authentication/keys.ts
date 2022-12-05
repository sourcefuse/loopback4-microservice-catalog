// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '../../constants';
import {HttpAuthenticationVerifier} from './types';
/**
 * @param {SwaggerAuthenticationBindings} - Creating a namespace called `SwaggerAuthenticationBindings`
 * @param {VERIFIER} - Creating a constant called `VERIFIER.`
 * */
export namespace SwaggerAuthenticationBindings {
  export const VERIFIER = BindingKey.create<HttpAuthenticationVerifier>(
    `${BINDING_PREFIX}.swagger-auth.verifier`,
  );
}

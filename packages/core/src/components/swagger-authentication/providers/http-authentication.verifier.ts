// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {SFCoreBindings} from '../../../keys';
import {CoreConfig} from '../../../types';
import {HttpAuthenticationVerifier} from '../types';

/**
 * @param {HttpAuthenticationVerifierProvider} - exporting `HttpAuthenticationVerifierProvider`
 * that implements the Provider interface.
 * */
export class HttpAuthenticationVerifierProvider
  implements Provider<HttpAuthenticationVerifier>
{
  /**
   * @param {SFCoreBindings} - Injecting the `config` object from the binding `SFCoreBindings`.
   * @return returns username and password from interface `coreConfig`.
   * */
  constructor(
    @inject(SFCoreBindings.config, {optional: true})
    private readonly coreConfig: CoreConfig,
  ) {}
  value(): HttpAuthenticationVerifier {
    return (username, password) => {
      return (
        username === this.coreConfig.swaggerUsername &&
        password === this.coreConfig.swaggerPassword
      );
    };
  }
}

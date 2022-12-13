﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SwaggerAuthenticationBindings} from './keys';
import {AuthenticateSwaggerMiddlewareInterceptor} from './middlewares';
import {HttpAuthenticationVerifierProvider} from './providers/http-authentication.verifier';

/**
 *  `SwaggerAuthenticationComponent` a class for swagger authentication.
 *   Injectng instance `RestApplication` into the component.
 *  `HttpAuthenticationVerifierProvider` Provider that is used to verify the authentication.
 */
export class SwaggerAuthenticationComponent implements Component {
  providers?: ProviderMap;
  bindings: Binding[] = [];
  repositories?: Class<Repository<Model>>[];
  models?: Class<Model>[];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.providers = {
      [SwaggerAuthenticationBindings.VERIFIER.key]:
        HttpAuthenticationVerifierProvider,
    };
    this.application.middleware(AuthenticateSwaggerMiddlewareInterceptor);
  }
}

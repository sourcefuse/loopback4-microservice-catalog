// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {repositories} from './repositories';
import {controllers} from './controllers';
import {models} from './models';
import {OIDC_PROVIDER, OidcProviderProvider} from './provider/oidc.provider';
import {OidcInitializerService} from './services';
import {TemplateBindings} from './keys';
import path from 'path';
export class OidcServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  providers: ProviderMap = {
    [OIDC_PROVIDER.key]:OidcProviderProvider
  };

  services = [
    OidcInitializerService
  ];
  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  bindings?: Binding[];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.component(CoreComponent);
    this.models = models;
    this.controllers = controllers;
    this.repositories = repositories;
    this.bindings = [
      new Binding(TemplateBindings.TemplateBasePath).to(path.join(__dirname, '../public/views')),
    ];
    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Oidc Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
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
import {
  AuthClientRepository,
  UserCredentialsRepository,
  UserRepository,
} from './repositories';
import {OidcController} from './controllers';
import {OidcProviderProvider, FindAccountProvider} from './providers';
import {OidcInitializerService} from './services';
import {OIDCServiceBindings} from './keys';
import path from 'path';
import {AuthClient, User} from './models';
export class OidcServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  providers: ProviderMap = {
    [OIDCServiceBindings.OIDC_PROVIDER.key]: OidcProviderProvider,
    [OIDCServiceBindings.FIND_ACCOUNT_PROVIDER.key]: FindAccountProvider,
  };

  services = [OidcInitializerService];
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
    this.models = [User, AuthClient];
    this.controllers = [OidcController];
    this.repositories = [
      AuthClientRepository,
      UserRepository,
      UserCredentialsRepository,
    ];
    this.bindings = [
      new Binding(OIDCServiceBindings.LoginTemplate).to(
        path.join(__dirname, '../public/views/login.ejs'),
      ),
      new Binding(OIDCServiceBindings.InteractionTemplate).to(
        path.join(__dirname, '../public/views/interaction.ejs'),
      ),
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

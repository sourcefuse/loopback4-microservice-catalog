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
import {CoreComponent} from '@sourceloop/core';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  HelmetSecurityBindings,
  Loopback4HelmetComponent,
} from 'loopback4-helmet';

import {controllers} from './controllers';
import {AuthServiceBindings} from './keys';
import {models} from './models';
import {
  BearerTokenVerifyProvider,
  ClientPasswordVerifyProvider,
  GoogleOauth2VerifyProvider,
  LocalPasswordVerifyProvider,
  ResourceOwnerVerifyProvider,
} from './modules/auth';
import {repositories} from './repositories';
import {MySequence} from './sequence';
import {IAuthServiceConfig} from './types';
import {KeycloakVerifyProvider} from './modules/auth/providers/keycloak-verify.provider';

export class AuthenticationServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly notifConfig?: IAuthServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    // Mount authentication component
    this.setupAuthenticationComponent();

    // Mount authorization component
    this.setupAuthorizationComponent();

    // Mount Helmet component
    this.application.component(Loopback4HelmetComponent);
    this.bindings.push(
      Binding.bind(HelmetSecurityBindings.CONFIG).to({
        referrerPolicy: {
          policy: 'same-origin',
        },
        contentSecurityPolicy: {
          directives: {
            frameSrc: ["'self'"],
          },
        },
      }),
    );

    // Mount default sequence if needed
    this.setupSequence();

    this.repositories = repositories;

    this.models = models;

    this.controllers = controllers;
  }

  providers: ProviderMap = {};

  bindings: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   * @param bindings Binding array
   */
  setupSequence() {
    this.application.sequence(MySequence);
  }

  setupAuthenticationComponent() {
    // Add authentication component
    this.application.component(AuthenticationComponent);
    // Customize authentication verify handlers
    this.providers[
      Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key
    ] = ClientPasswordVerifyProvider;
    this.providers[
      Strategies.Passport.LOCAL_PASSWORD_VERIFIER.key
    ] = LocalPasswordVerifyProvider;
    this.providers[
      Strategies.Passport.BEARER_TOKEN_VERIFIER.key
    ] = BearerTokenVerifyProvider;
    this.providers[
      Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key
    ] = ResourceOwnerVerifyProvider;
    this.providers[
      Strategies.Passport.GOOGLE_OAUTH2_VERIFIER.key
    ] = GoogleOauth2VerifyProvider;
    this.providers[
      Strategies.Passport.KEYCLOAK_VERIFIER.key
    ] = KeycloakVerifyProvider;
  }

  setupAuthorizationComponent() {
    // Add authorization component
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}

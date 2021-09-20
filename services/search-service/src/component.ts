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
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {DEFAULT_COLUMNS} from './const';
import {defineSearchController} from './controllers';
import {SearchControllerCtor} from './controllers/types';
import {SearchServiceBindings} from './keys';
import {SearchQuery, SearchResult} from './models';
import {MySqlQueryBuilder, PsqlQueryBuilder} from './classes';
import {SearchProvider} from './services';
import {SearchServiceConfig} from './types';

export class SearchServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    if (!this.config?.useCustomSequence) {
      this.setupSequence();
    }

    this.models = [SearchQuery];

    this.providers = {
      [SearchServiceBindings.SearchFunction.key]: SearchProvider,
    };

    this.application
      .bind(SearchServiceBindings.MySQLQueryBuilder)
      .to(MySqlQueryBuilder);
    this.application
      .bind(SearchServiceBindings.PostgreSQLQueryBuilder)
      .to(PsqlQueryBuilder);

    this.application
      .bind(SearchServiceBindings.FetchedColumns)
      .to(DEFAULT_COLUMNS);

    let controllerCtor: SearchControllerCtor<SearchResult> =
      defineSearchController(SearchResult);
    if (this.config) {
      if (!this.config.useCustomSequence) {
        this.setupSequence();
      }
      if (this.config.type) {
        controllerCtor = defineSearchController(
          this.config.type,
          this.config.controller,
        );
      } else if (this.config.controller) {
        controllerCtor = defineSearchController(
          SearchResult,
          this.config.controller,
        );
      } else {
        // do nothing
      }
    }

    inject(SearchServiceBindings.SearchFunction)(controllerCtor, undefined, 0);
    inject(SearchServiceBindings.Config)(controllerCtor, undefined, 1);

    this.controllers = [controllerCtor];
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
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}

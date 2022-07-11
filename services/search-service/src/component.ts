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
import {
  Class,
  Model,
  ModelDefinition,
  repository,
  Repository,
} from '@loopback/repository';
import {HttpErrors, RestApplication} from '@loopback/rest';
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
import {DEFAULT_COLUMNS, Errors, THREE, TWO} from './const';
import {defineSearchController} from './controllers';
import {SearchControllerCtor} from './controllers/types';
import {SearchServiceBindings} from './keys';
import {SearchQuery, SearchResult} from './models';
import {MySqlQueryBuilder, PsqlQueryBuilder} from './classes';
import {SearchFilterProvider, SearchProvider} from './services';
import {SearchServiceConfig} from './types';
import {RecentSearchRepository} from './repositories/recent-search.repository';
import {SearchQueryRepository} from './repositories/search-query.repository';
import {isSearchableModel, SearchControllerConfig} from '.';
import {defineModelClass} from './utils';

export class SearchServiceComponent<T extends Model> implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig<T>,
  ) {
    this.bindings = [];
    this.providers = {};

    if (!this.config.doNotMountCoreComponent) {
      // Mount core component
      this.application.component(CoreComponent);
    }

    if (!this.config?.useCustomSequence) {
      this.setupSequence();
    }

    this.models = [SearchQuery];

    this.providers = {
      [SearchServiceBindings.SearchFunction.key]: SearchProvider,
      [SearchServiceBindings.SearchFilterFunction.key]: SearchFilterProvider,
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
      const models = this.config.models.map(model => {
        if (isSearchableModel(model)) {
          return model.identifier ?? model.model.modelName;
        } else {
          return model.modelName;
        }
      });
      const controllerConfig: SearchControllerConfig = {
        name: '',
        basePath: '/search',
        authorizations: ['*'],
        ...this.config.controller,
      };
      if (this.config.type) {
        controllerCtor = defineSearchController(
          this.createResultModel(this.config.type, models),
          controllerConfig,
        );
      } else if (this.config.controller) {
        this.models = [SearchResult];
        controllerCtor = defineSearchController(
          this.createResultModel(SearchResult, models),
          controllerConfig,
        );
      } else {
        // do nothing
      }
    }

    inject(SearchServiceBindings.SearchFunction)(controllerCtor, undefined, 0);
    inject(SearchServiceBindings.Config)(controllerCtor, undefined, 1);
    repository(RecentSearchRepository)(controllerCtor, undefined, TWO);
    inject(SearchServiceBindings.SearchFilterFunction)(
      controllerCtor,
      undefined,
      THREE,
    );

    this.controllers = [controllerCtor];
    this.repositories = [RecentSearchRepository, SearchQueryRepository];
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
    if (
      !this.config.controller?.authenticate ||
      !this.config.controller.authorizations
    ) {
      throw new HttpErrors.InternalServerError(Errors.AUTHENTICATION_SETUP);
    }
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

  createResultModel(base: typeof Model, models: string[]) {
    const modelDef = new ModelDefinition({
      name: 'SearchResults',
      properties: {
        rank: {
          type: 'Number',
          required: true,
        },
        source: {
          type: 'string',
          jsonSchema: {
            enum: models,
          },
        },
      },
    });
    return defineModelClass<typeof base>(base, modelDef);
  }
}

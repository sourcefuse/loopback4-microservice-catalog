﻿// Copyright (c) 2023 Sourcefuse Technologies
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
  JwtKeysRepository,
  ServiceSequence,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {isSearchableModel, SearchControllerConfig} from '.';
import {MySqlQueryBuilder, PsqlQueryBuilder} from './classes';
import {DEFAULT_COLUMNS, Errors, THREE, TWO} from './const';
import {defineSearchController} from './controllers';
import {SearchControllerCtor} from './controllers/types';
import {SearchServiceBindings} from './keys';
import {SearchQuery, SearchResult} from './models';
import {RecentSearchRepository} from './repositories/recent-search.repository';
import {SearchQueryRepository} from './repositories/search-query.repository';
import {RecentSearchRepository as RecentSearchSequelizeRepository} from './repositories/sequelize/recent-search.repository';
import {SearchQueryRepository as SearchQuerySequelizeRepository} from './repositories/sequelize/search-query.repository';
import {SearchFilterProvider, SearchProvider} from './services';
import {
  SearchModelProvider,
  SearchProvider as SearchSequelizeProvider,
} from './services/sequelize';
import {SearchServiceConfig} from './types';
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
    this.models = [SearchQuery];

    if (!this.config.doNotMountCoreComponent) {
      // Mount core component
      this.application.component(CoreComponent);
    }

    if (!this.config?.useCustomSequence) {
      this.setupSequence();
    }

    this.application
      .bind(SearchServiceBindings.MySQLQueryBuilder)
      .to(MySqlQueryBuilder);
    this.application
      .bind(SearchServiceBindings.PostgreSQLQueryBuilder)
      .to(PsqlQueryBuilder);

    this.application
      .bind(SearchServiceBindings.FetchedColumns)
      .to(DEFAULT_COLUMNS);
  }

  /**
   * The function `_configureProvidersAndRepositories` sets up providers and repositories based on the
   * configuration for using Sequelize in a TypeScript application.
   */
  private _configureProvidersAndRepositories() {
    const useSequelize = this.config?.useSequelize;

    this.providers = {
      [SearchServiceBindings.SearchFunction.key]: useSequelize
        ? SearchSequelizeProvider
        : SearchProvider,
      [SearchServiceBindings.SearchFilterFunction.key]: SearchFilterProvider,
      [SearchServiceBindings.modelProvider.key]: SearchModelProvider,
    };

    this.repositories = useSequelize
      ? [
          RecentSearchSequelizeRepository,
          SearchQuerySequelizeRepository,
          SequelizeJwtKeysRepository,
        ]
      : [RecentSearchRepository, SearchQueryRepository, JwtKeysRepository];
  }

  /**
   * The function `_setupSearchController` sets up a search controller based on configuration settings.
   * @returns If the condition `if (!this.config)` is true, then the function will return early and
   * nothing will be executed beyond that point.
   */
  private _setupSearchController() {
    if (!this.config) return;

    const models = this.getSearchableModelIdentifiers(this.config);
    const controllerConfig: SearchControllerConfig = {
      name: '',
      basePath: '/search',
      authorizations: ['*'],
      ...this.config.controller,
    };

    let controllerCtor: SearchControllerCtor<SearchResult>;

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
      throw new Error(
        'Invalid configuration: Either type or controller must be provided',
      );
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
  }

  getSearchableModelIdentifiers(config: SearchServiceConfig<T>) {
    return config.models.map(model => {
      if (isSearchableModel(model)) {
        return model.identifier ?? model.model.modelName;
      } else {
        return model.modelName;
      }
    });
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

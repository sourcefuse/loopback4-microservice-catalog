// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  ControllerClass,
  Binding,
  ProviderMap,
} from '@loopback/core';
import {ReportingServiceComponentBindings} from './keys';
import {CoreComponent} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {
  DEFAULT_REPORTING_SERVICE_OPTIONS,
  ReportingServiceComponentOptions,
} from './types';
import {Queries, MetabaseToken} from './models';
import {
  QueriesController,
  QueryDataController,
  MetabaseTokenController,
} from './controllers';
import {MetabaseTokenRepository, QueriesRepository} from './repositories';
import {ReportingProvider, ReportingBindings} from './providers';

// Configure the binding for ReportingServiceComponent
@injectable({
  tags: {[ContextTags.KEY]: ReportingServiceComponentBindings.COMPONENT},
})
export class ReportingServiceComponent implements Component {
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
  bindings?: Binding[] = [];
  providers?: ProviderMap = {};
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: Application,
    @config()
    private readonly options: ReportingServiceComponentOptions = DEFAULT_REPORTING_SERVICE_OPTIONS,
  ) {
    this.bindings = [];
    this.application.component(CoreComponent);
    this.models = [Queries, MetabaseToken];
    this.controllers = [
      QueriesController,
      MetabaseTokenController,
      QueryDataController,
    ];
    this.repositories = [MetabaseTokenRepository, QueriesRepository];
    this.providers = {
      [ReportingBindings.ReportingHelper.key]: ReportingProvider,
    };
  }
}

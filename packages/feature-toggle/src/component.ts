﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Component,
  ProviderMap,
  Binding,
  inject,
  CoreBindings,
  ServiceOrProviderClass,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {CoreComponent} from '@sourceloop/core';
import {StrategyBindings} from './keys';
import {FeatureToggleActionMiddlewareInterceptor} from './middlewares';
import {
  FeatureFlagActionProvider,
  FeatureFlagMetadataProvider,
} from './providers';
import {FeatureHandlerService} from './services';

export class FeatureToggleComponent implements Component {
  providers?: ProviderMap;
  bindings?: Binding[];
  services?: ServiceOrProviderClass[];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    // Mount core component
    this.application.component(CoreComponent);

    this.application.middleware(FeatureToggleActionMiddlewareInterceptor);

    this.providers = {
      [StrategyBindings.FEATURE_FLAG_ACTION.key]: FeatureFlagActionProvider,
      [StrategyBindings.METADATA.key]: FeatureFlagMetadataProvider,
    };
    this.services = [FeatureHandlerService];
  }
}

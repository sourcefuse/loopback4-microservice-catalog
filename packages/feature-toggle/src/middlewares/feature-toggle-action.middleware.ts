// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  globalInterceptor,
  inject,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors, MiddlewareContext, Middleware} from '@loopback/rest';
import {StrategyBindings} from '../keys';
import {FeatureFlagFn} from '../types';

@globalInterceptor()
export class FeatureToggleActionMiddlewareInterceptor
  implements Provider<Middleware>
{
  constructor(
    @inject(StrategyBindings.FEATURE_FLAG_ACTION)
    protected checkFeatureFlag: FeatureFlagFn,
  ) {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    context: MiddlewareContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    const featureFlagEnabled: boolean = await this.checkFeatureFlag();

    if (!featureFlagEnabled) {
      throw new HttpErrors.Forbidden(
        'This particular feature is not accessible to you',
      );
    }
    return next();
  }
}

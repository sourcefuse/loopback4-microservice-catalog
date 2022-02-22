import {
  globalInterceptor,
  inject,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {MiddlewareContext, Middleware} from '@loopback/express';
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
      throw new HttpErrors.Forbidden('Feature Flag is disabled');
    }
    return next();
  }
}

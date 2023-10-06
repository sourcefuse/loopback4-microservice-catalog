// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, Provider, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AndFilterStrategy, FilterContext, OrFilterStrategy} from '../classes';
import {StrategyBindings} from '../keys';
import {FeatureHandlerService} from '../services';
import {
  FeatureFlagFn,
  FeatureFlagMetadata,
  FilterStrategy,
  FilterType,
  IAuthUserWithDisabledFeat,
} from '../types';

export class FeatureFlagActionProvider implements Provider<FeatureFlagFn> {
  /* The `filterStrategyMapping` is an array that maps the `FilterType` to the corresponding
  `FilterStrategy`. It is used to determine the appropriate filter strategy based on the
  `FilterType` specified in the feature flag metadata provided by user through decorator. */
  filterStrategyMapping: {
    filterType: FilterType;
    strategy: FilterStrategy;
  }[] = [
    {
      filterType: 'AND',
      strategy: new AndFilterStrategy(),
    },
    {
      filterType: 'OR',
      strategy: new OrFilterStrategy(),
    },
  ];
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user?: IAuthUserWithDisabledFeat,
    @service(FeatureHandlerService)
    private readonly handlerService?: FeatureHandlerService,
  ) {}
  value(): FeatureFlagFn {
    return () => this.action();
  }

  async action(): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();

    if (metadata && this.user) {
      const featureToCheck: string[] = ([] as string[]).concat(
        metadata.featureKey,
      );
      if (featureToCheck.length && featureToCheck[0] === '*') {
        // skip the check and always return true
        return true;
      }

      const disabledFeatures = this.user?.disabledFeatures;
      if (!disabledFeatures) {
        throw new HttpErrors.InternalServerError(
          'List of disabled features not passed to user',
        );
      }

      /* The code is creating a new instance of the `FilterContext` class and setting its strategy
      based on the `operator` specified in the `metadata.options` object. */
      const context = new FilterContext();
      context.setStrategy(this.getStrategy(metadata.options?.operator));

      /* Checking if the feature specified in the decorator is allowed or not based on the
      `disabledFeatures` array provided in the token. */
      const isAllowed =
        context.filter(featureToCheck, disabledFeatures).length <= 0;

      if (!isAllowed) {
        return false;
      } else {
        // check for handler
        const handler = metadata.options?.handler;

        if (handler) {
          return this.handlerService?.handle(metadata, this.user) ?? true;
        }
        return true;
      }
    } else {
      // not mandatory to apply feature check over all API
      return true;
    }
  }

  getStrategy(operator: FilterType | undefined) {
    /* Filtering strategy based on the `operator` specified in the decorator. It uses the
    `filterStrategyMapping` array to map the `FilterType` to the corresponding `FilterStrategy`.
     If strategy is not provided in the decorator default OR strategy will work */
    return (
      this.filterStrategyMapping.find(value => value.filterType === operator)
        ?.strategy ?? new OrFilterStrategy()
    );
  }
}

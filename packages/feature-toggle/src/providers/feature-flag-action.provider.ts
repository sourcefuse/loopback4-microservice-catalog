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

  /**
   * This TypeScript function checks if a user is allowed to access certain features based on feature
   * flags and user settings.
   * @returns The `action` function returns a `Promise<boolean>`. The function first retrieves metadata
   * using `this.getMetadata()`, then checks if the metadata and user exist. If either is missing, it
   * returns `true`. It then proceeds to get a list of features, check if feature checking should be
   * skipped, and verify if the user has disabled features. If disabled features are not available, an
   * `InternalServerError
   */
  async action(): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();

    if (!metadata || !this.user) {
      return true; // Not mandatory to apply feature check over all APIs
    }

    const featureList = this._getFeatureList(metadata);
    if (this._shouldSkipFeatureCheck(featureList)) {
      return true;
    }

    const disabledFeatures = this.user?.disabledFeatures;
    if (!disabledFeatures) {
      throw new HttpErrors.InternalServerError(
        'List of disabled features not passed to user',
      );
    }

    const isAllowed = this._isFeatureAllowed(
      featureList,
      disabledFeatures,
      metadata,
    );
    if (!isAllowed) {
      return false;
    }

    return this._handleCustomFeatureLogic(metadata);
  }

  /**
   * The function `_getFeatureList` returns an array containing the feature key from the provided
   * `FeatureFlagMetadata` object.
   * @param {FeatureFlagMetadata} metadata - The `metadata` parameter is of type `FeatureFlagMetadata`,
   * which likely contains information about a feature flag such as its key, description, status, and
   * any other relevant data related to feature flags.
   * @returns An array of strings containing the feature key from the provided FeatureFlagMetadata
   * object.
   */
  private _getFeatureList(metadata: FeatureFlagMetadata): string[] {
    return ([] as string[]).concat(metadata.featureKey);
  }

  /**
   * The function `_shouldSkipFeatureCheck` checks if the first element of a feature list is '*' and
   * returns a boolean value.
   * @param {string[]} featureList - FeatureList is an array of strings that contains a list of
   * features.
   * @returns a boolean value, which is determined by whether the length of the `featureList` array is
   * greater than 0 and the first element of the array is equal to '*'.
   */
  private _shouldSkipFeatureCheck(featureList: string[]): boolean {
    return featureList.length > 0 && featureList[0] === '*';
  }

  /**
   * The function `_isFeatureAllowed` determines if a feature is allowed based on a list of features,
   * disabled features, and feature flag metadata.
   * @param {string[]} featureList - The `featureList` parameter is an array of strings that contains
   * the list of features that you want to check for permission or enablement.
   * @param {string[]} disabledFeatures - The `disabledFeatures` parameter is an array of strings that
   * contains the list of features that are currently disabled or not allowed.
   * @param {FeatureFlagMetadata} metadata - The `metadata` parameter in the `_isFeatureAllowed`
   * function likely contains information related to feature flags, such as the options and operator
   * used for filtering the feature list. It seems to be of type `FeatureFlagMetadata`.
   * @returns A boolean value is being returned from the `_isFeatureAllowed` function.
   */
  private _isFeatureAllowed(
    featureList: string[],
    disabledFeatures: string[],
    metadata: FeatureFlagMetadata,
  ): boolean {
    const context = new FilterContext();
    context.setStrategy(this.getStrategy(metadata.options?.operator));
    return context.filter(featureList, disabledFeatures).length <= 0;
  }

  /**
   * The function `_handleCustomFeatureLogic` checks for a handler in the metadata options and calls
   * the handler service if available.
   * @param {FeatureFlagMetadata} metadata - The `metadata` parameter is of type `FeatureFlagMetadata`
   * and contains information about a specific feature flag, such as its options and configuration.
   * @returns The method `_handleCustomFeatureLogic` is returning a boolean value or a Promise that
   * resolves to a boolean value. If the `handler` is defined in the `metadata.options` and `this.user`
   * is truthy, then it calls the `handle` method of `handlerService` with the `metadata` and
   * `this.user` as arguments. If `handlerService` is not null or
   */
  private _handleCustomFeatureLogic(
    metadata: FeatureFlagMetadata,
  ): boolean | Promise<boolean> {
    const handler = metadata.options?.handler;
    if (handler && this.user) {
      return this.handlerService?.handle(metadata, this.user) ?? true;
    }
    return true;
  }

  /**
   * The `getStrategy` function returns a filtering strategy based on the specified `operator` or
   * defaults to an OR strategy.
   * @param {FilterType | undefined} operator - The `operator` parameter in the `getStrategy` function
   * is of type `FilterType | undefined`. It is used to determine the filtering strategy based on the
   * specified `FilterType`. If no `operator` is provided, the function will default to using the OR
   * filter strategy.
   * @returns The `getStrategy` function returns a filtering strategy based on the `operator` specified
   * in the decorator. It uses the `filterStrategyMapping` array to map the `FilterType` to the
   * corresponding `FilterStrategy`. If the specified `operator` is found in the mapping, the
   * corresponding strategy is returned. If not found, it defaults to using the `OrFilterStrategy`.
   */
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

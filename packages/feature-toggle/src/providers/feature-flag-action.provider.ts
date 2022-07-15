// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, Provider} from '@loopback/core';
import {intersection} from 'lodash';
import {AuthenticationBindings} from 'loopback4-authentication';
import {StrategyBindings} from '../keys';
import {
  FeatureFlagFn,
  FeatureFlagMetadata,
  IAuthUserWithDisabledFeat,
} from '../types';
import {HttpErrors} from '@loopback/rest';

export class FeatureFlagActionProvider implements Provider<FeatureFlagFn> {
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user?: IAuthUserWithDisabledFeat,
  ) {}
  value(): FeatureFlagFn {
    return () => this.action();
  }

  async action(): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();

    if (metadata) {
      const featureToCheck: string[] = [metadata.featureKey];
      if (featureToCheck.length && featureToCheck[0] === '*') {
        return true; // skip the check and always return true
      }
      const disabledFeatures = this.user?.disabledFeatures;
      if (!disabledFeatures) {
        throw new HttpErrors.InternalServerError(
          'List of disabled features not passed to user',
        );
      }
      return intersection(featureToCheck, disabledFeatures).length <= 0;
    } else {
      return false; // need to pass metadata to decorator
    }
  }
}

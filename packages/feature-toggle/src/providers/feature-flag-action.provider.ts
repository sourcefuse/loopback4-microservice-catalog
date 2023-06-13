// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, Provider, service} from '@loopback/core';
import {intersection} from 'lodash';
import {AuthenticationBindings} from 'loopback4-authentication';
import {StrategyBindings} from '../keys';
import {
  FeatureFlagFn,
  FeatureFlagMetadata,
  IAuthUserWithDisabledFeat,
} from '../types';
import {HttpErrors} from '@loopback/rest';
import {FeatureHandlerService} from '../services';

export class FeatureFlagActionProvider implements Provider<FeatureFlagFn> {
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user?: IAuthUserWithDisabledFeat,
    @service(FeatureHandlerService)
    private handlerService?: FeatureHandlerService,
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
      const disabledFeatures = this.user?.disabledFeatures ?? [];
      if (!disabledFeatures) {
        throw new HttpErrors.InternalServerError(
          'List of disabled features not passed to user',
        );
      }

      const isAllowed =
        intersection(featureToCheck, disabledFeatures).length <= 0;
      if (!isAllowed) {
        return false;
      } else {
        // check for handler
        const handler = metadata.options?.handler;

        if (handler) {
          await this.handlerService?.handle(handler);
        }
        return true;
      }
    } else {
      return true; // not mandatory to apply feature check over all API
    }
  }
}

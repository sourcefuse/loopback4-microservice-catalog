// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface FeatureFlagMetadata {
  featureKey: string;
  options?: Object;
}

export interface FeatureInterface {
  (): Promise<boolean>;
}

export interface FeatureFlagFn {
  (): Promise<boolean>;
}

export interface IAuthUserWithDisabledFeat extends IAuthUserWithPermissions {
  disabledFeatures: string[];
}

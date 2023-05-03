// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface FeatureFlagMetadata {
  featureKey: string;
  options?: Object;
}

export type FeatureInterface = () => Promise<boolean>;

export type FeatureFlagFn = () => Promise<boolean>;

export interface IAuthUserWithDisabledFeat extends IAuthUserWithPermissions {
  disabledFeatures: string[];
}

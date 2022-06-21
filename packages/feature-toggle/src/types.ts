import {IAuthUserWithPermissions} from '@sourceloop/core';

/**
 * Interface defining the component's options object
 */
export interface FeatureToggleComponentOptions {
  // Add the definitions here
}
/**
 * Default options for the component
 */
export const DEFAULT_FEATURE_TOGGLE_OPTIONS: FeatureToggleComponentOptions = {
  // Specify the values here
};

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

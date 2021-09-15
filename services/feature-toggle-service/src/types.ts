import {BindingKey} from '@loopback/core';

export const FeatureToggleDbName = 'FeatureToggleDB';

export interface FeatureFlagMetadata {
  features: (BindingKey<FeatureInterface> | string)[];
  options?: Object;
}

export interface FeatureFlagFn {
  (): Promise<boolean>;
}

export interface FeatureInterface {
  (): boolean;
}

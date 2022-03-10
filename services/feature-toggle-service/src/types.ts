import {BindingKey} from '@loopback/core';
import {IServiceConfig} from '@sourceloop/core';

export const FeatureToggleDbName = 'FeatureToggleDB';
export const FeatureToggleCacheDb = 'FeatureToggleCache';

export interface FeatureFlagMetadata {
  feature: string;
  strategies: (BindingKey<FeatureInterface> | string)[];
  options?: Object;
}

export interface FeatureFlagFn {
  (): Promise<boolean>;
}

export interface FeatureInterface {
  (): Promise<boolean>;
}

export interface IToggleServiceConfig extends IServiceConfig {
  bindControllers: boolean;
}

import {IServiceConfig} from '@sourceloop/core';

export const FeatureToggleDbName = 'FeatureToggleDB';
export interface IToggleServiceConfig extends IServiceConfig {
  bindControllers: boolean;
}

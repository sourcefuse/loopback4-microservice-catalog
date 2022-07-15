// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig} from '@sourceloop/core';

export const FeatureToggleDbName = 'FeatureToggleDB';
export interface IToggleServiceConfig extends IServiceConfig {
  bindControllers: boolean;
}

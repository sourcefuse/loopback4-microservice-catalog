// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig} from '@sourceloop/core';
import {IAuthUser} from 'loopback4-authentication';

export const FeatureToggleDbName = 'FeatureToggleDB';
export interface IToggleServiceConfig extends IServiceConfig {
  bindControllers: boolean;
}

export type TempUser = {
  userTenantId: string;
  tenantType: string;
  tenantId?: string;
} & IAuthUser;

// export type BootstrapDTO = {
//   plan: {
//     features: FeaturesDTO[];
//     [key: string]: any;
//   };
//   tenant: AnyObject;
//   [key: string]: any;
// };

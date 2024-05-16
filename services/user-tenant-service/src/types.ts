// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig} from '@sourceloop/core';
import {IAuthUser} from 'loopback4-authentication';
/**
 * Interface defining the component's options object
 */
export interface UserTenantServiceComponentOptions {
  // Add the definitions here
}

/**
 * Default options for the component
 */
export const DEFAULT_USER_SERVICE_OPTIONS: UserTenantServiceComponentOptions = {
  // Specify the values here
};

export interface IUserServiceConfig extends IServiceConfig {}

export type TempUser = {
  userTenantId: string;
  tenantType: string;
  tenantId?: string;
} & IAuthUser;

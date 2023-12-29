// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Interface defining the component's options object
 */

import {IServiceConfig} from '@sourceloop/core';

// sonarignore:start
export interface PaymentServiceComponentOptions {
  // Add the definitions here
}
// sonarignore:end

/**
 * Default options for the component
 */
export const DEFAULT_PAYMENT_SERVICE_OPTIONS: PaymentServiceComponentOptions = {
  // Specify the values here
};
export interface PaymentServiceConfig extends IServiceConfig {
  //do nothing
}

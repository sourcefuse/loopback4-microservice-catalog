// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Interface defining the component's options object
 */
// sonarignore:start

export type SpecParameter = {
  name: string;
};
export interface ControllerMethodWithSpecs {
  spec: {
    parameters: SpecParameter[];
  };
}
export interface UserTenantServiceComponentOptions {
  enableTenantFilter: boolean;
}
// sonarignore:end

/**
 * Default options for the component
 */
export const DEFAULT_USER_TENANT_SERVICE_OPTIONS: UserTenantServiceComponentOptions =
  {
    enableTenantFilter: false,
    // Specify the values here
  };
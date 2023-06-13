// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingTemplate, extensionFor} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface FeatureFlagMetadata {
  featureKey: string;
  options?: FeatureFlagOptions;
}

export type FeatureInterface = () => Promise<boolean>;

export type FeatureFlagOptions = {
  handler: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any; //NOSONAR
};

export type FeatureFlagFn = () => Promise<boolean>;

export interface IAuthUserWithDisabledFeat extends IAuthUserWithPermissions {
  disabledFeatures: string[];
}

/** Chnages for extension point */

/**
 * Typically an extension point defines an interface as the contract for
 * extensions to implement
 */
export interface FeatureHandler {
  handlerName: string;
  handle(
    featureMetadata: FeatureFlagMetadata,
    currentUser: IAuthUserWithDisabledFeat,
  ): boolean;
}

/**
 * Name/id of the handler extension point
 */

export const HANDLER_EXTENSION_POINT_NAME = 'handlers';

/**
 * A binding template for handler extensions
 */
export const asFeatureHandler: BindingTemplate = binding => {
  extensionFor(HANDLER_EXTENSION_POINT_NAME)(binding);
  binding.tag({namespace: 'handlers'});
};

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Provider,
  CoreBindings,
  Constructor,
  MetadataInspector,
  inject,
} from '@loopback/core';
import {FEATURE_FLAG_METADATA_ACCESSOR} from '../keys';
import {FeatureFlagMetadata} from '../types';

export class FeatureFlagMetadataProvider
  implements Provider<FeatureFlagMetadata | undefined>
{
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
  ) {}
  value(): FeatureFlagMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    return getFeatureFlagMetadata(this.controllerClass, this.methodName);
  }
}

export function getFeatureFlagMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): FeatureFlagMetadata | undefined {
  return MetadataInspector.getMethodMetadata<FeatureFlagMetadata>(
    FEATURE_FLAG_METADATA_ACCESSOR,
    controllerClass.prototype,
    methodName,
  );
}

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {MethodDecoratorFactory} from '@loopback/core';
import {FeatureFlagMetadata} from '../types';
import {FEATURE_FLAG_METADATA_ACCESSOR} from '../keys';

export function featureFlag(metadata: FeatureFlagMetadata) {
  return MethodDecoratorFactory.createDecorator<FeatureFlagMetadata>(
    FEATURE_FLAG_METADATA_ACCESSOR,
    {
      featureKey: metadata.featureKey,
      options: metadata.options ?? {},
    },
  );
}

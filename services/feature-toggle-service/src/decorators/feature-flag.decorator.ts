import {MethodDecoratorFactory} from '@loopback/core';
import {FeatureFlagMetadata} from '../types';
import {FEATURE_FLAG_METADATA_ACCESSOR} from '../keys';

export function featuresFlag(metadata: FeatureFlagMetadata) {
  return MethodDecoratorFactory.createDecorator<FeatureFlagMetadata>(
    FEATURE_FLAG_METADATA_ACCESSOR,
    {
      feature: metadata.feature,
      strategies: metadata.strategies || [],
      options: metadata.options ?? {},
    },
  );
}

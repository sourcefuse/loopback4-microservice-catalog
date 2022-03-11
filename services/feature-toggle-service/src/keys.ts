import {BindingKey, MetadataAccessor} from '@loopback/core';
import {
  FeatureFlagFn,
  FeatureFlagMetadata,
  FeatureInterface,
  IToggleServiceConfig,
} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace StrategyBindings {
  export const FEATURE_FLAG_ACTION = BindingKey.create<FeatureFlagFn>(
    'sf.featureflag.actions.toggle',
  );
  export const METADATA = BindingKey.create<FeatureFlagMetadata | undefined>(
    'sf.featuresFlag.operationsMetadata',
  );
  export const TENANT_STRATEGY =
    BindingKey.create<FeatureInterface>('sf.tenant.strategy');
  export const USER_STRATEGY =
    BindingKey.create<FeatureInterface>('sf.user.strategy');
  export const SYSTEM_STRATEGY =
    BindingKey.create<FeatureInterface>('sf.system.strategy');
}

export const FEATURE_FLAG_METADATA_ACCESSOR = MetadataAccessor.create<
  FeatureFlagMetadata,
  MethodDecorator
>('sf.featuresFlag.accessor.operationsMetadata');

export namespace FeatureToggleBindings {
  export const Config = BindingKey.create<IToggleServiceConfig | null>(
    `${BINDING_PREFIX}.auth.config`,
  );
}

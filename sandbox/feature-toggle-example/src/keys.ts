import {BindingKey} from '@loopback/core';
import {FeatureInterface} from '@sourceloop/feature-toggle-service';

export namespace FeatureToggleBindings {
  export const ROLE_REATURE =
    BindingKey.create<FeatureInterface>('sf.role.feature');
}

import {BindingTemplate, extensionFor} from '@loopback/core';

export const OBSERVABILITY_PROFILE_EXTENSION_POINT_NAME =
  'sf.packages.observability.profiles';

export const asObservabilityProfile: BindingTemplate = binding => {
  extensionFor(OBSERVABILITY_PROFILE_EXTENSION_POINT_NAME)(binding);
  binding.tag({namespace: OBSERVABILITY_PROFILE_EXTENSION_POINT_NAME});
};

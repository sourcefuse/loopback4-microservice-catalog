import {
  ObservabilityProfileName,
  ObservabilityProfile,
  ProfileBootstrapContext,
  ProfileInitResult,
  ResolvedObservabilityConfig,
} from '../types';
import {BaseOtlpObservabilityProfile} from './otlp.profile';

export class DatadogObservabilityProfile
  extends BaseOtlpObservabilityProfile
  implements ObservabilityProfile
{
  name = 'datadog';

  supports(profile: ObservabilityProfileName): boolean {
    return profile === this.name;
  }

  applyDefaults(
    config: ResolvedObservabilityConfig,
  ): ResolvedObservabilityConfig {
    return {
      ...config,
      resourceAttributes: {
        'vendor.apm': 'datadog',
        ...config.resourceAttributes,
      },
    };
  }

  initialize(
    config: ResolvedObservabilityConfig,
    context: ProfileBootstrapContext,
  ): ProfileInitResult {
    return super.initialize(this.applyDefaults(config), context);
  }
}

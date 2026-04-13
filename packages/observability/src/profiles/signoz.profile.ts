import {
  ObservabilityProfileName,
  ObservabilityProfile,
  ProfileBootstrapContext,
  ProfileInitResult,
  ResolvedObservabilityConfig,
} from '../types';
import {BaseOtlpObservabilityProfile} from './otlp.profile';

export class SignozObservabilityProfile
  extends BaseOtlpObservabilityProfile
  implements ObservabilityProfile
{
  name = 'signoz';

  supports(profile: ObservabilityProfileName): boolean {
    return profile === this.name;
  }

  applyDefaults(
    config: ResolvedObservabilityConfig,
  ): ResolvedObservabilityConfig {
    return {
      ...config,
      resourceAttributes: {
        'vendor.apm': 'signoz',
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

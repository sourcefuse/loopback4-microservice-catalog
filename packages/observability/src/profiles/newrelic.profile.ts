import {
  ObservabilityProfileName,
  ObservabilityProfile,
  ProfileBootstrapContext,
  ProfileInitResult,
  ResolvedObservabilityConfig,
} from '../types';
import {BaseOtlpObservabilityProfile} from './otlp.profile';

export class NewRelicObservabilityProfile
  extends BaseOtlpObservabilityProfile
  implements ObservabilityProfile
{
  name = 'newrelic';

  supports(profile: ObservabilityProfileName): boolean {
    return profile === this.name;
  }

  applyDefaults(
    config: ResolvedObservabilityConfig,
  ): ResolvedObservabilityConfig {
    return {
      ...config,
      otlpHeaders: {
        ...config.otlpHeaders,
      },
      resourceAttributes: {
        'vendor.apm': 'newrelic',
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

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
    const licenseKey = process.env.NEW_RELIC_LICENSE_KEY?.trim();
    const otlpEndpoint =
      config.otlpEndpoint ??
      (config.exporterProtocol === 'grpc'
        ? 'https://otlp.nr-data.net:4317'
        : 'https://otlp.nr-data.net:4318/v1/traces');

    return {
      ...config,
      otlpEndpoint,
      otlpHeaders: {
        ...(licenseKey ? {'api-key': licenseKey} : {}),
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

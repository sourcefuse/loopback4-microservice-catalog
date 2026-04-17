import {
  ObservabilityProfileName,
  ObservabilityProfile,
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
    const apiKey = process.env.DD_API_KEY?.trim();
    const otlpEndpoint =
      config.otlpEndpoint ??
      (config.exporterProtocol === 'grpc'
        ? 'http://localhost:4317'
        : 'http://localhost:4318/v1/traces');

    return {
      ...config,
      otlpEndpoint,
      otlpHeaders: {
        ...(apiKey ? {'dd-api-key': apiKey} : {}),
        ...config.otlpHeaders,
      },
      resourceAttributes: {
        'vendor.apm': 'datadog',
        ...config.resourceAttributes,
      },
    };
  }
}

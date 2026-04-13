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
    const otlpEndpoint =
      config.otlpEndpoint ??
      (config.exporterProtocol === 'grpc'
        ? 'http://localhost:4317'
        : 'http://localhost:4318/v1/traces');

    return {
      ...config,
      otlpEndpoint,
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

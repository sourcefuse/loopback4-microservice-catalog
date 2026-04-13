import {ResolvedObservabilityConfig} from '../types';

export function validateObservabilityConfig(
  config: ResolvedObservabilityConfig,
): void {
  if (!config.serviceName.trim()) {
    throw new Error('Observability serviceName must be a non-empty string.');
  }

  if (
    config.sampler === 'traceidratio' &&
    (config.samplerArg < 0 || config.samplerArg > 1)
  ) {
    throw new Error(
      'Observability samplerArg must be between 0 and 1 for traceidratio.',
    );
  }

  if (!config.enabled || config.profile === 'none') {
    return;
  }
}

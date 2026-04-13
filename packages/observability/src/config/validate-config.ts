import {ResolvedObservabilityConfig} from '../types';
import {
  getEnabledInstrumentations,
  INSTRUMENTATION_MODULE_REQUIREMENTS,
} from '../profiles/instrumentations';

function assertDependencyInstalled(moduleName: string, message: string): void {
  try {
    require.resolve(moduleName);
  } catch {
    throw new Error(message);
  }
}

function isDependencyInstalled(moduleName: string): boolean {
  try {
    require.resolve(moduleName);
    return true;
  } catch {
    return false;
  }
}

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

  if (config.instrumentations.express && !config.instrumentations.http) {
    throw new Error(
      'Observability express instrumentation requires http instrumentation to be enabled.',
    );
  }

  for (const instrumentation of getEnabledInstrumentations(config)) {
    for (const requirement of INSTRUMENTATION_MODULE_REQUIREMENTS[
      instrumentation
    ]) {
      if (requirement.type === 'all') {
        for (const moduleName of requirement.modules) {
          assertDependencyInstalled(
            moduleName,
            `Install the optional peer dependency "${moduleName}" or disable the "${instrumentation}" instrumentation.`,
          );
        }
        continue;
      }

      if (!requirement.modules.some(isDependencyInstalled)) {
        throw new Error(
          `Install one of the optional peer dependencies "${requirement.modules.join(
            '" or "',
          )}" or disable the "${instrumentation}" instrumentation.`,
        );
      }
    }
  }
}

import {
  ObservabilityConfig,
  ObservabilityProfile,
  ObservabilityRuntime,
} from './types';
import {resolveBootstrapConfig} from './config/resolve-config';
import {validateObservabilityConfig} from './config/validate-config';
import {
  DatadogObservabilityProfile,
  NewRelicObservabilityProfile,
  OtlpObservabilityProfile,
  SignozObservabilityProfile,
  createOtlpExporter,
} from './profiles';
import {
  clearRuntimeState,
  getRuntimeState,
  updateRuntimeState,
} from './runtime';

const BUILTIN_PROFILES: ObservabilityProfile[] = [
  new OtlpObservabilityProfile(),
  new NewRelicObservabilityProfile(),
  new SignozObservabilityProfile(),
  new DatadogObservabilityProfile(),
];

function resolveProfile(profileName: string): ObservabilityProfile {
  const profile = BUILTIN_PROFILES.find(candidate =>
    candidate.supports(profileName),
  );

  if (!profile) {
    throw new Error(
      `No observability profile registered for "${profileName}".`,
    );
  }

  return profile;
}

function buildDisabledRuntime(): ObservabilityRuntime {
  const config = getRuntimeState().config;
  return {
    enabled: false,
    profile: config?.profile ?? 'none',
    config:
      config ??
      resolveBootstrapConfig({
        enabled: false,
        profile: 'none',
      }),
    async shutdown() {
      clearRuntimeState();
    },
  };
}

export function bootstrapObservability(
  overrides?: Partial<ObservabilityConfig>,
): ObservabilityRuntime {
  const existingRuntime = getRuntimeState().runtime;
  if (existingRuntime) {
    return existingRuntime;
  }

  updateRuntimeState({bootstrapOverrides: overrides});
  const resolvedConfig = resolveBootstrapConfig(overrides);
  updateRuntimeState({config: resolvedConfig});

  if (!resolvedConfig.enabled || resolvedConfig.profile === 'none') {
    const runtime = buildDisabledRuntime();
    updateRuntimeState({runtime});
    return runtime;
  }

  const profile = resolveProfile(resolvedConfig.profile);
  const profileConfig = profile.applyDefaults(resolvedConfig);
  validateObservabilityConfig(profileConfig);

  const initResult = profile.initialize(profileConfig, {
    createExporter: createOtlpExporter,
  });

  updateRuntimeState({
    profile,
    config: profileConfig,
  });

  const runtime: ObservabilityRuntime = {
    enabled: true,
    profile: profile.name,
    config: profileConfig,
    tracerProvider: initResult.tracerProvider,
    async shutdown() {
      await profile.shutdown?.();
      clearRuntimeState();
    },
  };

  updateRuntimeState({runtime});
  return runtime;
}

export function bootstrapObservabilityFromEnv(): ObservabilityRuntime {
  return bootstrapObservability();
}

export async function shutdownObservability(): Promise<void> {
  const runtime = getRuntimeState().runtime;
  if (!runtime) {
    return;
  }

  await runtime.shutdown();
}

export function isObservabilityEnabled(): boolean {
  return getRuntimeState().runtime?.enabled ?? false;
}

export function getBootstrapProfile(): ObservabilityProfile | undefined {
  return getRuntimeState().profile;
}

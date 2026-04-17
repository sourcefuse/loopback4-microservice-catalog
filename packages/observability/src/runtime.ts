import {
  ObservabilityConfig,
  ObservabilityProfile,
  ObservabilityRuntime,
  ResolvedObservabilityConfig,
} from './types';

export type RuntimeState = {
  bootstrapOverrides?: Partial<ObservabilityConfig>;
  config?: ResolvedObservabilityConfig;
  profile?: ObservabilityProfile;
  runtime?: ObservabilityRuntime;
};

const state: RuntimeState = {};

function cloneConfig<
  T extends ObservabilityConfig | ResolvedObservabilityConfig,
>(config: T): T {
  return {
    ...config,
    instrumentations: config.instrumentations
      ? {...config.instrumentations}
      : config.instrumentations,
    customInstrumentations: config.customInstrumentations
      ? [...config.customInstrumentations]
      : config.customInstrumentations,
    otlpHeaders: config.otlpHeaders ? {...config.otlpHeaders} : undefined,
    resourceAttributes: config.resourceAttributes
      ? {...config.resourceAttributes}
      : config.resourceAttributes,
  };
}

function cloneRuntime(runtime: ObservabilityRuntime): ObservabilityRuntime {
  return {
    ...runtime,
    config: cloneConfig(runtime.config),
  };
}

export function getRuntimeState(): Readonly<RuntimeState> {
  return {
    bootstrapOverrides: state.bootstrapOverrides
      ? cloneConfig(state.bootstrapOverrides)
      : undefined,
    config: state.config ? cloneConfig(state.config) : undefined,
    profile: state.profile,
    runtime: state.runtime ? cloneRuntime(state.runtime) : undefined,
  };
}

export function updateRuntimeState(
  partial: Partial<RuntimeState>,
): RuntimeState {
  Object.assign(state, partial);
  return state;
}

export function clearRuntimeState(): void {
  state.bootstrapOverrides = undefined;
  state.config = undefined;
  state.profile = undefined;
  state.runtime = undefined;
}

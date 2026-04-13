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

export function getRuntimeState(): RuntimeState {
  return state;
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

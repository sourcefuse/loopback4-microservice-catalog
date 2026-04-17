import {strictEqual} from 'assert';
import {shutdownObservability} from '../../bootstrap';
import {DEFAULT_OBSERVABILITY_CONFIG} from '../../config/defaults';
import {
  clearRuntimeState,
  getRuntimeState,
  updateRuntimeState,
} from '../../runtime';

describe('runtime state', () => {
  afterEach(() => {
    clearRuntimeState();
  });

  it('returns a snapshot instead of the mutable backing state', () => {
    updateRuntimeState({
      config: {
        ...DEFAULT_OBSERVABILITY_CONFIG,
        enabled: true,
        profile: 'default',
        serviceName: 'runtime-state-service',
      },
    });

    const runtimeState = getRuntimeState();
    runtimeState.config!.serviceName = 'mutated-from-test';

    strictEqual(getRuntimeState().config?.serviceName, 'runtime-state-service');
  });

  it('swallows shutdown errors and clears runtime state', async () => {
    updateRuntimeState({
      runtime: {
        enabled: true,
        profile: 'default',
        config: {
          ...DEFAULT_OBSERVABILITY_CONFIG,
          enabled: true,
          profile: 'default',
          serviceName: 'shutdown-runtime-service',
        },
        shutdown: async () => {
          throw new Error('shutdown-failed');
        },
      },
    });

    await shutdownObservability();

    strictEqual(getRuntimeState().runtime, undefined);
  });
});

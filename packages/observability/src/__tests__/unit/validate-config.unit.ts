import {throws} from 'assert';
import {DEFAULT_OBSERVABILITY_CONFIG} from '../../config/defaults';
import {validateObservabilityConfig} from '../../config/validate-config';
import {ResolvedObservabilityConfig} from '../../types';

function buildConfig(
  overrides?: Partial<ResolvedObservabilityConfig>,
): ResolvedObservabilityConfig {
  return {
    ...DEFAULT_OBSERVABILITY_CONFIG,
    enabled: true,
    profile: 'default',
    serviceName: 'validate-config-service',
    ...overrides,
    instrumentations: {
      ...DEFAULT_OBSERVABILITY_CONFIG.instrumentations,
      ...overrides?.instrumentations,
    },
    resourceAttributes: {
      ...DEFAULT_OBSERVABILITY_CONFIG.resourceAttributes,
      ...overrides?.resourceAttributes,
    },
    otlpHeaders: {
      ...DEFAULT_OBSERVABILITY_CONFIG.otlpHeaders,
      ...overrides?.otlpHeaders,
    },
    customInstrumentations:
      overrides?.customInstrumentations ??
      DEFAULT_OBSERVABILITY_CONFIG.customInstrumentations,
  };
}

describe('validateObservabilityConfig', () => {
  it('rejects express instrumentation when http is disabled', () => {
    throws(
      () =>
        validateObservabilityConfig(
          buildConfig({
            instrumentations: {
              http: false,
              express: true,
              pg: false,
              mysql: false,
              redis: false,
              kafka: false,
            },
          }),
        ),
      /express instrumentation requires http instrumentation/i,
    );
  });
});

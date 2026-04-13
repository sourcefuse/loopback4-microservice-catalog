import {deepStrictEqual, strictEqual} from 'assert';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {DEFAULT_OBSERVABILITY_CONFIG} from '../../config/defaults';
import {
  createAutoInstrumentations,
  InstrumentationLoader,
} from '../../profiles/instrumentations';
import {ResolvedObservabilityConfig} from '../../types';

function buildConfig(
  overrides?: Partial<ResolvedObservabilityConfig>,
): ResolvedObservabilityConfig {
  return {
    ...DEFAULT_OBSERVABILITY_CONFIG,
    enabled: true,
    profile: 'default',
    serviceName: 'instrumentation-test-service',
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

describe('createAutoInstrumentations', () => {
  it('loads and enables only the configured instrumentations', () => {
    const tracerProvider = new NodeTracerProvider();
    const loaded: string[] = [];
    const enabled: string[] = [];

    const loader: InstrumentationLoader = name => {
      loaded.push(name);
      return [
        {
          disable() {},
          enable() {
            enabled.push(name);
          },
          setTracerProvider(provider) {
            strictEqual(provider, tracerProvider);
          },
        },
      ];
    };

    const instrumentations = createAutoInstrumentations(
      buildConfig({
        instrumentations: {
          http: true,
          express: false,
          pg: true,
          mysql: true,
          redis: false,
          kafka: true,
        },
      }),
      tracerProvider,
      loader,
    );

    strictEqual(instrumentations.length, 4);
    deepStrictEqual(loaded, ['http', 'pg', 'mysql', 'kafka']);
    deepStrictEqual(enabled, ['http', 'pg', 'mysql', 'kafka']);
  });

  it('enables custom instrumentations supplied through bootstrap config', () => {
    const tracerProvider = new NodeTracerProvider();
    let enabled = false;
    let disabled = false;

    const instrumentations = createAutoInstrumentations(
      buildConfig({
        instrumentations: {
          http: false,
          express: false,
          pg: false,
          mysql: false,
          redis: false,
          kafka: false,
        },
        customInstrumentations: [
          {
            disable() {
              disabled = true;
            },
            enable() {
              enabled = true;
            },
            setTracerProvider(provider) {
              strictEqual(provider, tracerProvider);
            },
          },
        ],
      }),
      tracerProvider,
    );

    strictEqual(instrumentations.length, 1);
    strictEqual(enabled, true);
    strictEqual(disabled, false);
  });
});

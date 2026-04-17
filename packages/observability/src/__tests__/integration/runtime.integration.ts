import {ok, strictEqual} from 'assert';
import {InMemorySpanExporter} from '@opentelemetry/sdk-trace-base';
import {DEFAULT_OBSERVABILITY_CONFIG} from '../../config/defaults';
import {
  addSpanAttributes,
  createPropagationHeaders,
  getTraceContext,
  recordException,
  withSpan,
} from '../../index';
import {OtlpObservabilityProfile} from '../../profiles';
import {ResolvedObservabilityConfig} from '../../types';

function buildConfig(
  overrides?: Partial<ResolvedObservabilityConfig>,
): ResolvedObservabilityConfig {
  return {
    ...DEFAULT_OBSERVABILITY_CONFIG,
    enabled: true,
    profile: 'default',
    serviceName: 'runtime-test-service',
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

describe('observability runtime', () => {
  let profile: OtlpObservabilityProfile | undefined;

  afterEach(async () => {
    await profile?.shutdown();
    profile = undefined;
  });

  it('initializes a tracer runtime and exposes active trace correlation', async () => {
    profile = new OtlpObservabilityProfile();

    const initResult = profile.initialize(
      buildConfig({
        instrumentations: {
          http: true,
          express: true,
          pg: false,
          mysql: false,
          redis: false,
          kafka: false,
        },
      }),
      {
        createExporter: () => new InMemorySpanExporter(),
      },
    );

    ok(initResult.tracerProvider);

    await withSpan('runtime-test-span', async () => {
      addSpanAttributes({
        'test.case': 'runtime',
      });

      recordException(new Error('runtime-test-error'));

      const traceContext = getTraceContext();
      ok(traceContext.traceId);
      ok(traceContext.spanId);

      const headers = createPropagationHeaders();
      ok(headers.traceparent);
    });

    strictEqual(initResult.exporterName, 'InMemorySpanExporter');
  });
});

import {strictEqual} from 'assert';
import {DEFAULT_OBSERVABILITY_CONFIG} from '../../config/defaults';
import {DatadogObservabilityProfile} from '../../profiles/datadog.profile';
import {NewRelicObservabilityProfile} from '../../profiles/newrelic.profile';
import {SignozObservabilityProfile} from '../../profiles/signoz.profile';
import {ResolvedObservabilityConfig} from '../../types';

function buildConfig(
  overrides?: Partial<ResolvedObservabilityConfig>,
): ResolvedObservabilityConfig {
  return {
    ...DEFAULT_OBSERVABILITY_CONFIG,
    enabled: true,
    profile: 'default',
    serviceName: 'profile-test-service',
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

describe('built-in profile defaults', () => {
  afterEach(() => {
    delete process.env.NEW_RELIC_LICENSE_KEY;
    delete process.env.DD_API_KEY;
  });

  it('applies New Relic OTLP defaults', () => {
    process.env.NEW_RELIC_LICENSE_KEY = 'new-relic-license';

    const config = new NewRelicObservabilityProfile().applyDefaults(
      buildConfig({
        profile: 'newrelic',
      }),
    );

    strictEqual(config.otlpEndpoint, 'https://otlp.nr-data.net:4318/v1/traces');
    strictEqual(config.otlpHeaders['api-key'], 'new-relic-license');
    strictEqual(config.resourceAttributes['vendor.apm'], 'newrelic');
  });

  it('applies SigNoz collector defaults', () => {
    const config = new SignozObservabilityProfile().applyDefaults(
      buildConfig({
        profile: 'signoz',
      }),
    );

    strictEqual(config.otlpEndpoint, 'http://localhost:4318/v1/traces');
    strictEqual(config.resourceAttributes['vendor.apm'], 'signoz');
  });

  it('applies Datadog OTLP defaults', () => {
    process.env.DD_API_KEY = 'datadog-api-key';

    const config = new DatadogObservabilityProfile().applyDefaults(
      buildConfig({
        profile: 'datadog',
      }),
    );

    strictEqual(config.otlpEndpoint, 'http://localhost:4318/v1/traces');
    strictEqual(config.otlpHeaders['dd-api-key'], 'datadog-api-key');
    strictEqual(config.resourceAttributes['vendor.apm'], 'datadog');
  });
});

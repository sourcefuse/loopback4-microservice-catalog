import {deepStrictEqual, strictEqual} from 'assert';
import {
  resolveBootstrapConfig,
  resolveComponentConfig,
} from '../../config/resolve-config';
import {clearRuntimeState, updateRuntimeState} from '../../runtime';

describe('config resolution', () => {
  afterEach(() => {
    delete process.env.OBSERVABILITY_ENABLED;
    delete process.env.OBSERVABILITY_PROFILE;
    delete process.env.OBSERVABILITY_PROVIDER;
    delete process.env.MS_NAME;
    delete process.env.OTEL_SERVICE_NAME;
    delete process.env.OTEL_RESOURCE_ATTRIBUTES;
    clearRuntimeState();
  });

  it('prefers bootstrap overrides for startup-critical fields', () => {
    process.env.OBSERVABILITY_ENABLED = 'false';
    process.env.OBSERVABILITY_PROFILE = 'none';

    const config = resolveBootstrapConfig({
      enabled: true,
      profile: 'default',
      serviceName: 'bootstrap-service',
    });

    strictEqual(config.enabled, true);
    strictEqual(config.profile, 'default');
    strictEqual(config.serviceName, 'bootstrap-service');
  });

  it('uses DI config only for component-level enrichment', () => {
    process.env.MS_NAME = 'bootstrap-service';
    process.env.OTEL_RESOURCE_ATTRIBUTES = 'cloud.region=us-east-1';

    const bootstrapConfig = resolveBootstrapConfig({
      enabled: true,
      profile: 'default',
      serviceVersion: '1.0.0',
    });
    updateRuntimeState({config: bootstrapConfig});

    const componentConfig = resolveComponentConfig({
      profile: 'signoz',
      serviceVersion: '2.0.0',
      environment: 'staging',
      resourceAttributes: {
        'deployment.color': 'blue',
      },
    });

    strictEqual(componentConfig.profile, 'default');
    strictEqual(componentConfig.serviceVersion, '2.0.0');
    strictEqual(componentConfig.environment, 'staging');
    deepStrictEqual(componentConfig.resourceAttributes, {
      'cloud.region': 'us-east-1',
      'deployment.color': 'blue',
    });
  });
});

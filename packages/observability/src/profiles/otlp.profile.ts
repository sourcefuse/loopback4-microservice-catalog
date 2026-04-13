import {Resource, detectResourcesSync} from '@opentelemetry/resources';
import {
  AlwaysOffSampler,
  AlwaysOnSampler,
  BatchSpanProcessor,
  ParentBasedSampler,
  SpanExporter,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import {ATTR_DEPLOYMENT_ENVIRONMENT} from '@opentelemetry/semantic-conventions/incubating';
import {
  ObservabilityProfileName,
  ObservabilityProfile,
  ProfileBootstrapContext,
  ProfileInitResult,
  ResolvedObservabilityConfig,
} from '../types';
import {
  createAutoInstrumentations,
  ManagedInstrumentation,
} from './instrumentations';

function resolveSampler(config: ResolvedObservabilityConfig) {
  switch (config.sampler) {
    case 'always_off':
      return new AlwaysOffSampler();
    case 'traceidratio':
      return new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(config.samplerArg),
      });
    case 'always_on':
    default:
      return new AlwaysOnSampler();
  }
}

function buildResource(config: ResolvedObservabilityConfig): Resource {
  const attributes: Record<string, string> = {
    ...config.resourceAttributes,
    [ATTR_SERVICE_NAME]: config.serviceName,
  };

  if (config.serviceVersion) {
    attributes[ATTR_SERVICE_VERSION] = config.serviceVersion;
  }

  if (config.environment) {
    attributes[ATTR_DEPLOYMENT_ENVIRONMENT] = config.environment;
  }

  return detectResourcesSync().merge(new Resource(attributes));
}

function loadOtlpExporter(config: ResolvedObservabilityConfig): SpanExporter {
  if (config.exporterProtocol === 'grpc') {
    const otlpGrpc = require('@opentelemetry/exporter-trace-otlp-grpc') as {
      OTLPTraceExporter: new (options?: object) => SpanExporter;
    };

    return new otlpGrpc.OTLPTraceExporter({
      url: config.otlpEndpoint,
      metadata: Object.keys(config.otlpHeaders).length
        ? config.otlpHeaders
        : undefined,
    });
  }

  const otlpHttp = require('@opentelemetry/exporter-trace-otlp-http') as {
    OTLPTraceExporter: new (options?: object) => SpanExporter;
  };

  return new otlpHttp.OTLPTraceExporter({
    url: config.otlpEndpoint,
    headers: Object.keys(config.otlpHeaders).length
      ? config.otlpHeaders
      : undefined,
  });
}

export abstract class BaseOtlpObservabilityProfile implements ObservabilityProfile {
  abstract name: ObservabilityProfileName;

  private instrumentations: ManagedInstrumentation[] = [];
  private tracerProvider?: NodeTracerProvider;

  supports(profile: ObservabilityProfileName): boolean {
    return profile === this.name;
  }

  applyDefaults(
    config: ResolvedObservabilityConfig,
  ): ResolvedObservabilityConfig {
    return config;
  }

  initialize(
    config: ResolvedObservabilityConfig,
    context: ProfileBootstrapContext,
  ): ProfileInitResult {
    const exporter = context.createExporter(config);
    const tracerProvider = new NodeTracerProvider({
      resource: buildResource(config),
      sampler: resolveSampler(config),
      spanProcessors: [new BatchSpanProcessor(exporter)],
    });

    tracerProvider.register();
    this.instrumentations = createAutoInstrumentations(config, tracerProvider);
    this.tracerProvider = tracerProvider;

    return {
      exporterName: loadOtlpExporter.name,
      tracerProvider,
    };
  }

  async shutdown(): Promise<void> {
    for (const instrumentation of this.instrumentations) {
      instrumentation.disable();
    }
    this.instrumentations = [];

    await (this.tracerProvider?.shutdown() ?? Promise.resolve());
    this.tracerProvider = undefined;
  }
}

export class OtlpObservabilityProfile extends BaseOtlpObservabilityProfile {
  name: ObservabilityProfileName = 'default';
}

export function createOtlpExporter(
  config: ResolvedObservabilityConfig,
): SpanExporter {
  return loadOtlpExporter(config);
}

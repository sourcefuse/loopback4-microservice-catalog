import {BindingTemplate, Constructor} from '@loopback/core';
import {SpanExporter} from '@opentelemetry/sdk-trace-base';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';

export type AttributeValue = string | number | boolean;

export type ObservabilityProfileName =
  | 'none'
  | 'default'
  | 'newrelic'
  | 'signoz'
  | 'datadog'
  | (string & {});

export type ExporterProtocol = 'grpc' | 'http/protobuf';

export type SamplerName = 'always_on' | 'always_off' | 'traceidratio';

export interface ObservabilityInstrumentation {
  disable(): void;
  enable(): void;
  setTracerProvider?(tracerProvider: NodeTracerProvider): void;
}

export interface InstrumentationToggles {
  http: boolean;
  express: boolean;
  pg: boolean;
  mysql: boolean;
  redis: boolean;
  kafka: boolean;
}

export interface ObservabilityConfig {
  enabled?: boolean;
  profile?: ObservabilityProfileName;
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
  otlpEndpoint?: string;
  otlpHeaders?: Record<string, string>;
  exporterProtocol?: ExporterProtocol;
  sampler?: SamplerName;
  samplerArg?: number;
  instrumentations?: Partial<InstrumentationToggles>;
  customInstrumentations?: ObservabilityInstrumentation[];
  resourceAttributes?: Record<string, string>;
}

export interface ResolvedObservabilityConfig {
  enabled: boolean;
  profile: ObservabilityProfileName;
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  otlpEndpoint?: string;
  otlpHeaders: Record<string, string>;
  exporterProtocol: ExporterProtocol;
  sampler: SamplerName;
  samplerArg: number;
  instrumentations: InstrumentationToggles;
  customInstrumentations: ObservabilityInstrumentation[];
  resourceAttributes: Record<string, string>;
}

export interface ProfileInitResult {
  exporterName: string;
  tracerProvider: NodeTracerProvider;
}

export interface ObservabilityRuntime {
  enabled: boolean;
  profile: ObservabilityProfileName;
  config: ResolvedObservabilityConfig;
  tracerProvider?: NodeTracerProvider;
  shutdown(): Promise<void>;
}

export interface ProfileBootstrapContext {
  createExporter(config: ResolvedObservabilityConfig): SpanExporter;
}

export interface ObservabilityProfile {
  name: ObservabilityProfileName;
  supports(profile: ObservabilityProfileName): boolean;
  applyDefaults(
    config: ResolvedObservabilityConfig,
  ): ResolvedObservabilityConfig;
  initialize(
    config: ResolvedObservabilityConfig,
    context: ProfileBootstrapContext,
  ): ProfileInitResult;
  shutdown?(): Promise<void>;
}

export interface ProfileRegistration {
  key: string;
  profileClass: Constructor<ObservabilityProfile>;
  template: BindingTemplate;
}

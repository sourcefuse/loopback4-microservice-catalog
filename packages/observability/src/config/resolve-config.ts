import {
  ExporterProtocol,
  InstrumentationToggles,
  ObservabilityConfig,
  ResolvedObservabilityConfig,
  SamplerName,
} from '../types';
import {
  DEFAULT_INSTRUMENTATIONS,
  DEFAULT_OBSERVABILITY_CONFIG,
} from './defaults';
import {getRuntimeState} from '../runtime';

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value == null) {
    return undefined;
  }

  switch (value.trim().toLowerCase()) {
    case '1':
    case 'true':
    case 'yes':
    case 'on':
      return true;
    case '0':
    case 'false':
    case 'no':
    case 'off':
      return false;
    default:
      return undefined;
  }
}

function parseNumber(value: string | undefined): number | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseExporterProtocol(
  value: string | undefined,
): ExporterProtocol | undefined {
  if (value === 'grpc' || value === 'http/protobuf') {
    return value;
  }

  return undefined;
}

function parseSamplerName(value: string | undefined): SamplerName | undefined {
  if (
    value === 'always_on' ||
    value === 'always_off' ||
    value === 'traceidratio'
  ) {
    return value;
  }

  return undefined;
}

function parseHeaders(value: string | undefined): Record<string, string> {
  if (!value) {
    return {};
  }

  return value
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((headers, header) => {
      const separatorIndex = header.indexOf('=');
      if (separatorIndex < 1) {
        return headers;
      }

      const key = header.slice(0, separatorIndex).trim();
      const headerValue = header.slice(separatorIndex + 1).trim();
      if (key && headerValue) {
        headers[key] = headerValue;
      }
      return headers;
    }, {});
}

function parseResourceAttributes(
  value: string | undefined,
): Record<string, string> {
  return parseHeaders(value);
}

const INSTRUMENTATION_ENV_VARS: Record<keyof InstrumentationToggles, string> = {
  http: 'OBSERVABILITY_INSTRUMENT_HTTP',
  express: 'OBSERVABILITY_INSTRUMENT_EXPRESS',
  pg: 'OBSERVABILITY_INSTRUMENT_PG',
  mysql: 'OBSERVABILITY_INSTRUMENT_MYSQL',
  redis: 'OBSERVABILITY_INSTRUMENT_REDIS',
  kafka: 'OBSERVABILITY_INSTRUMENT_KAFKA',
};

function resolveInstrumentationToggle(
  key: keyof InstrumentationToggles,
  overrides?: Partial<InstrumentationToggles>,
): boolean {
  return (
    overrides?.[key] ??
    parseBoolean(process.env[INSTRUMENTATION_ENV_VARS[key]]) ??
    DEFAULT_INSTRUMENTATIONS[key]
  );
}

function startupInstrumentationConfig(
  overrides?: Partial<InstrumentationToggles>,
): InstrumentationToggles {
  const keys = Object.keys(
    DEFAULT_INSTRUMENTATIONS,
  ) as (keyof InstrumentationToggles)[];

  return keys.reduce((result, key) => {
    result[key] = resolveInstrumentationToggle(key, overrides);
    return result;
  }, {} as InstrumentationToggles);
}

function resolveServiceInfo(
  overrides: Partial<ObservabilityConfig> | undefined,
  env: NodeJS.ProcessEnv,
  enabled: boolean,
) {
  const profile =
    overrides?.profile ??
    env.OBSERVABILITY_PROFILE ??
    env.OBSERVABILITY_PROVIDER ??
    (enabled ? 'default' : DEFAULT_OBSERVABILITY_CONFIG.profile);

  const serviceName =
    overrides?.serviceName ??
    env.OTEL_SERVICE_NAME ??
    env.MS_NAME ??
    DEFAULT_OBSERVABILITY_CONFIG.serviceName;

  return {
    profile,
    serviceName,
    serviceVersion: overrides?.serviceVersion ?? env.SERVICE_VERSION,
    environment: overrides?.environment ?? env.NODE_ENV,
  };
}

function resolveExporterConfig(
  overrides: Partial<ObservabilityConfig> | undefined,
  env: NodeJS.ProcessEnv,
) {
  const exporterProtocol =
    overrides?.exporterProtocol ??
    parseExporterProtocol(env.OTEL_EXPORTER_OTLP_PROTOCOL) ??
    DEFAULT_OBSERVABILITY_CONFIG.exporterProtocol;

  const sampler =
    overrides?.sampler ??
    parseSamplerName(env.OTEL_TRACES_SAMPLER) ??
    DEFAULT_OBSERVABILITY_CONFIG.sampler;

  const samplerArg =
    overrides?.samplerArg ??
    parseNumber(env.OTEL_TRACES_SAMPLER_ARG) ??
    DEFAULT_OBSERVABILITY_CONFIG.samplerArg;

  const otlpEndpoint =
    overrides?.otlpEndpoint ??
    env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
    env.OTEL_EXPORTER_OTLP_ENDPOINT;

  const otlpHeaders = {
    ...parseHeaders(env.OTEL_EXPORTER_OTLP_HEADERS),
    ...overrides?.otlpHeaders,
  };

  return {
    exporterProtocol,
    sampler,
    samplerArg,
    otlpEndpoint,
    otlpHeaders,
  };
}

export function resolveBootstrapConfig(
  bootstrapOverrides?: Partial<ObservabilityConfig>,
): ResolvedObservabilityConfig {
  const env = process.env;

  const enabled =
    bootstrapOverrides?.enabled ??
    parseBoolean(env.OBSERVABILITY_ENABLED) ??
    DEFAULT_OBSERVABILITY_CONFIG.enabled;

  const serviceInfo = resolveServiceInfo(bootstrapOverrides, env, enabled);
  const exporterConfig = resolveExporterConfig(bootstrapOverrides, env);

  const resourceAttributes = {
    ...parseResourceAttributes(env.OTEL_RESOURCE_ATTRIBUTES),
    ...bootstrapOverrides?.resourceAttributes,
  };

  return {
    enabled,
    ...serviceInfo,
    ...exporterConfig,
    instrumentations: startupInstrumentationConfig(
      bootstrapOverrides?.instrumentations,
    ),
    customInstrumentations: bootstrapOverrides?.customInstrumentations ?? [],
    resourceAttributes,
  };
}

export function resolveComponentConfig(
  diConfig?: ObservabilityConfig,
): ResolvedObservabilityConfig {
  const resolvedBootstrapConfig =
    getRuntimeState().config ?? resolveBootstrapConfig();

  return {
    ...resolvedBootstrapConfig,
    serviceVersion:
      diConfig?.serviceVersion ?? resolvedBootstrapConfig.serviceVersion,
    environment: diConfig?.environment ?? resolvedBootstrapConfig.environment,
    resourceAttributes: {
      ...resolvedBootstrapConfig.resourceAttributes,
      ...diConfig?.resourceAttributes,
    },
  };
}

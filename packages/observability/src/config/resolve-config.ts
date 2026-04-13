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

function startupInstrumentationConfig(
  overrides?: Partial<InstrumentationToggles>,
): InstrumentationToggles {
  const env = process.env;

  return {
    http:
      overrides?.http ??
      parseBoolean(env.OBSERVABILITY_INSTRUMENT_HTTP) ??
      DEFAULT_INSTRUMENTATIONS.http,
    express:
      overrides?.express ??
      parseBoolean(env.OBSERVABILITY_INSTRUMENT_EXPRESS) ??
      DEFAULT_INSTRUMENTATIONS.express,
    pg:
      overrides?.pg ??
      parseBoolean(env.OBSERVABILITY_INSTRUMENT_PG) ??
      DEFAULT_INSTRUMENTATIONS.pg,
    redis:
      overrides?.redis ??
      parseBoolean(env.OBSERVABILITY_INSTRUMENT_REDIS) ??
      DEFAULT_INSTRUMENTATIONS.redis,
    kafka:
      overrides?.kafka ??
      parseBoolean(env.OBSERVABILITY_INSTRUMENT_KAFKA) ??
      DEFAULT_INSTRUMENTATIONS.kafka,
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

  const profile =
    bootstrapOverrides?.profile ??
    env.OBSERVABILITY_PROFILE ??
    env.OBSERVABILITY_PROVIDER ??
    (enabled ? 'default' : DEFAULT_OBSERVABILITY_CONFIG.profile);

  const serviceName =
    bootstrapOverrides?.serviceName ??
    env.OTEL_SERVICE_NAME ??
    env.MS_NAME ??
    DEFAULT_OBSERVABILITY_CONFIG.serviceName;

  const serviceVersion =
    bootstrapOverrides?.serviceVersion ?? env.SERVICE_VERSION;

  const environment = bootstrapOverrides?.environment ?? env.NODE_ENV;

  const exporterProtocol = (bootstrapOverrides?.exporterProtocol ??
    (env.OTEL_EXPORTER_OTLP_PROTOCOL as ExporterProtocol | undefined) ??
    DEFAULT_OBSERVABILITY_CONFIG.exporterProtocol) as ExporterProtocol;

  const sampler = (bootstrapOverrides?.sampler ??
    (env.OTEL_TRACES_SAMPLER as SamplerName | undefined) ??
    DEFAULT_OBSERVABILITY_CONFIG.sampler) as SamplerName;

  const samplerArg =
    bootstrapOverrides?.samplerArg ??
    parseNumber(env.OTEL_TRACES_SAMPLER_ARG) ??
    DEFAULT_OBSERVABILITY_CONFIG.samplerArg;

  const otlpEndpoint =
    bootstrapOverrides?.otlpEndpoint ??
    env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
    env.OTEL_EXPORTER_OTLP_ENDPOINT;

  const otlpHeaders = {
    ...parseHeaders(env.OTEL_EXPORTER_OTLP_HEADERS),
    ...bootstrapOverrides?.otlpHeaders,
  };

  const resourceAttributes = {
    ...parseResourceAttributes(env.OTEL_RESOURCE_ATTRIBUTES),
    ...bootstrapOverrides?.resourceAttributes,
  };

  return {
    enabled,
    profile,
    serviceName,
    serviceVersion,
    environment,
    otlpEndpoint,
    otlpHeaders,
    exporterProtocol,
    sampler,
    samplerArg,
    instrumentations: startupInstrumentationConfig(
      bootstrapOverrides?.instrumentations,
    ),
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

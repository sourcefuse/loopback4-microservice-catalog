import {ResolvedObservabilityConfig} from '../types';

export const DEFAULT_INSTRUMENTATIONS = {
  http: true,
  express: true,
  pg: false,
  mysql: false,
  redis: false,
  kafka: false,
};

export const DEFAULT_OBSERVABILITY_CONFIG: ResolvedObservabilityConfig = {
  enabled: false,
  profile: 'none',
  serviceName: 'application',
  exporterProtocol: 'http/protobuf',
  otlpHeaders: {},
  sampler: 'always_on',
  samplerArg: 1,
  instrumentations: DEFAULT_INSTRUMENTATIONS,
  customInstrumentations: [],
  resourceAttributes: {},
};

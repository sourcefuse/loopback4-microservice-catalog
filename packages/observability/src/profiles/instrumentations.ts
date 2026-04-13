import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {
  ObservabilityInstrumentation,
  ResolvedObservabilityConfig,
} from '../types';

export type InstrumentationName =
  | 'http'
  | 'express'
  | 'pg'
  | 'mysql'
  | 'redis'
  | 'kafka';

export type InstrumentationModuleRequirement =
  | {type: 'all'; modules: string[]}
  | {type: 'any'; modules: string[]};

export const INSTRUMENTATION_MODULE_REQUIREMENTS: Record<
  InstrumentationName,
  InstrumentationModuleRequirement[]
> = {
  http: [{type: 'all', modules: ['@opentelemetry/instrumentation-http']}],
  express: [{type: 'all', modules: ['@opentelemetry/instrumentation-express']}],
  pg: [{type: 'all', modules: ['@opentelemetry/instrumentation-pg']}],
  mysql: [
    {
      type: 'any',
      modules: [
        '@opentelemetry/instrumentation-mysql',
        '@opentelemetry/instrumentation-mysql2',
      ],
    },
  ],
  redis: [{type: 'all', modules: ['@opentelemetry/instrumentation-redis']}],
  kafka: [{type: 'all', modules: ['@opentelemetry/instrumentation-kafkajs']}],
};

export type ManagedInstrumentation = ObservabilityInstrumentation;

export type InstrumentationLoader = (
  name: InstrumentationName,
) => ManagedInstrumentation[];

function isModuleInstalled(moduleName: string): boolean {
  try {
    require.resolve(moduleName);
    return true;
  } catch {
    return false;
  }
}

function loadInstrumentations(
  name: InstrumentationName,
): ManagedInstrumentation[] {
  switch (name) {
    case 'http': {
      const mod = require('@opentelemetry/instrumentation-http') as {
        HttpInstrumentation: new () => ManagedInstrumentation;
      };
      return [new mod.HttpInstrumentation()];
    }
    case 'express': {
      const mod = require('@opentelemetry/instrumentation-express') as {
        ExpressInstrumentation: new () => ManagedInstrumentation;
      };
      return [new mod.ExpressInstrumentation()];
    }
    case 'pg': {
      const mod = require('@opentelemetry/instrumentation-pg') as {
        PgInstrumentation: new () => ManagedInstrumentation;
      };
      return [new mod.PgInstrumentation()];
    }
    case 'mysql': {
      const instrumentations: ManagedInstrumentation[] = [];

      if (isModuleInstalled('@opentelemetry/instrumentation-mysql')) {
        const mysql = require('@opentelemetry/instrumentation-mysql') as {
          MySQLInstrumentation: new () => ManagedInstrumentation;
        };
        instrumentations.push(new mysql.MySQLInstrumentation());
      }

      if (isModuleInstalled('@opentelemetry/instrumentation-mysql2')) {
        const mysql2 = require('@opentelemetry/instrumentation-mysql2') as {
          MySQL2Instrumentation: new () => ManagedInstrumentation;
        };
        instrumentations.push(new mysql2.MySQL2Instrumentation());
      }

      return instrumentations;
    }
    case 'redis': {
      const redis = require('@opentelemetry/instrumentation-redis') as {
        RedisInstrumentation: new () => ManagedInstrumentation;
      };
      return [new redis.RedisInstrumentation()];
    }
    case 'kafka': {
      const mod = require('@opentelemetry/instrumentation-kafkajs') as {
        KafkaJsInstrumentation: new () => ManagedInstrumentation;
      };
      return [new mod.KafkaJsInstrumentation()];
    }
  }
}

export function createAutoInstrumentations(
  config: ResolvedObservabilityConfig,
  tracerProvider: NodeTracerProvider,
  loader: InstrumentationLoader = loadInstrumentations,
): ManagedInstrumentation[] {
  const instrumentationNames = getEnabledInstrumentations(config);
  const instrumentations = [
    ...instrumentationNames.flatMap(name => loader(name)),
    ...config.customInstrumentations,
  ];
  for (const instrumentation of instrumentations) {
    instrumentation.setTracerProvider?.(tracerProvider);
    instrumentation.enable();
  }

  return instrumentations;
}

export function getEnabledInstrumentations(
  config: ResolvedObservabilityConfig,
): InstrumentationName[] {
  const instrumentationNames: InstrumentationName[] = [];

  if (config.instrumentations.http) {
    instrumentationNames.push('http');
  }
  if (config.instrumentations.express) {
    instrumentationNames.push('express');
  }
  if (config.instrumentations.pg) {
    instrumentationNames.push('pg');
  }
  if (config.instrumentations.mysql) {
    instrumentationNames.push('mysql');
  }
  if (config.instrumentations.redis) {
    instrumentationNames.push('redis');
  }
  if (config.instrumentations.kafka) {
    instrumentationNames.push('kafka');
  }

  return instrumentationNames;
}

import {BindingKey} from '@loopback/core';
import {
  ObservabilityConfig,
  ObservabilityRuntime,
  ResolvedObservabilityConfig,
} from './types';

export namespace ObservabilityBindings {
  export const config = BindingKey.create<ObservabilityConfig>(
    'sf.packages.observability.config',
  );

  export const runtime = BindingKey.create<ObservabilityRuntime>(
    'sf.packages.observability.runtime',
  );

  export const resolvedConfig = BindingKey.create<ResolvedObservabilityConfig>(
    'sf.packages.observability.resolvedConfig',
  );
}

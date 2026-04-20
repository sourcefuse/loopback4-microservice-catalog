import {
  Binding,
  Component,
  Constructor,
  CoreBindings,
  createBindingFromClass,
  inject,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {resolveComponentConfig} from './config/resolve-config';
import {ObservabilityBindings} from './keys';
import {getRuntimeState} from './runtime';
import {ObservabilityConfig, ObservabilityProfile} from './types';
import {
  DatadogObservabilityProfile,
  NewRelicObservabilityProfile,
  ObservabilityProfileRegistry,
  SignozObservabilityProfile,
  OtlpObservabilityProfile,
  asObservabilityProfile,
} from './profiles';

const BUILTIN_PROFILE_CLASSES: Constructor<ObservabilityProfile>[] = [
  OtlpObservabilityProfile,
  NewRelicObservabilityProfile,
  SignozObservabilityProfile,
  DatadogObservabilityProfile,
];

export class ObservabilityComponent implements Component {
  bindings: Binding[] = [];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(ObservabilityBindings.config, {optional: true})
    private readonly config?: ObservabilityConfig,
  ) {
    const runtime = getRuntimeState().runtime;
    if (!runtime) {
      throw new Error(
        'ObservabilityComponent requires observability to be bootstrapped before the component is mounted.',
      );
    }

    const resolvedConfig = resolveComponentConfig(this.config);

    this.application.bind(ObservabilityBindings.runtime).to(runtime);
    this.application
      .bind(ObservabilityBindings.resolvedConfig)
      .to(resolvedConfig);

    this.bindings.push(createBindingFromClass(ObservabilityProfileRegistry));

    for (const profileClass of BUILTIN_PROFILE_CLASSES) {
      const binding = createBindingFromClass(profileClass);
      asObservabilityProfile(binding);
      this.bindings.push(binding);
    }
  }
}

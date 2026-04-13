# @sourceloop/observability

OpenTelemetry-first observability bootstrap and optional LoopBack integration for Sourceloop services.

## Design

This package follows a hybrid model:

1. **Bootstrap is the required startup path**
   Use bootstrap before your application imports go too far, so tracing can start early.
2. **The LoopBack component is optional**
   Use `ObservabilityComponent` only when you want DI-bound config, framework bindings, and profile extension-point integration.

That means this package should be thought of as:

- `bootstrap.ts`: core runtime startup
- `component.ts`: LoopBack adapter

## What It Provides

- Early env-led or override-led bootstrap for observability startup
- DI-bound config via `ObservabilityBindings.config`
- Built-in profiles for `default`, `newrelic`, `signoz`, and `datadog`
- LoopBack extension-point support for custom profiles
- Generic helpers for spans, exception recording, and propagation headers

## Startup Model

### Required: bootstrap

Call bootstrap in your service entrypoint before application construction.

```ts
import {bootstrapObservabilityFromEnv} from '@sourceloop/observability';

bootstrapObservabilityFromEnv();
```

You can also pass explicit startup config for tests or advanced bootstrap flows:

```ts
import {bootstrapObservability} from '@sourceloop/observability';

bootstrapObservability({
  enabled: true,
  profile: 'default',
  serviceName: 'audit-service',
});
```

### Optional: LoopBack component

Use the component only if you want framework-native bindings and DI config.

```ts
import {
  ObservabilityBindings,
  ObservabilityComponent,
} from '@sourceloop/observability';

this.bind(ObservabilityBindings.config).to({
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV,
  resourceAttributes: {
    'deployment.color': 'blue',
  },
});

this.component(ObservabilityComponent);
```

Important:

- Bootstrap controls startup-critical config.
- DI config is meant for component-level enrichment, not for replacing early bootstrap.
- If you skip bootstrap and rely only on DI config, early instrumentation will not be enabled.

## Config Resolution

The package resolves config in two stages.

### Bootstrap config

Resolved by `resolveBootstrapConfig()`.

Used for startup-critical fields such as:

- `enabled`
- `profile`
- `serviceName`
- exporter endpoint/protocol/headers
- sampler
- instrumentation toggles

Precedence:

1. bootstrap overrides
2. environment variables
3. defaults

### Component config

Resolved by `resolveComponentConfig()`.

Used for LoopBack/application enrichment such as:

- `serviceVersion`
- `environment`
- extra `resourceAttributes`

Precedence:

1. DI config
2. bootstrap-resolved config

## Profiles

Built-in profiles:

- `default`
- `newrelic`
- `signoz`
- `datadog`

`default` means plain OTLP behavior with no vendor-specific profile layered on top.

These profiles are implemented by profile classes inside the package. Custom profiles can be added using the LoopBack extension point exposed by the package.

## Dependencies

OTLP exporters are bundled as package dependencies because OTLP is the built-in transport path for all current profiles.

There are currently no vendor-native SDK dependencies in the package. The built-in `newrelic`, `signoz`, and `datadog` profiles are OTLP-oriented presets, not native agent integrations.

## Public API

Bootstrap/runtime:

- `bootstrapObservability()`
  Starts observability using explicit startup overrides. Use this in tests or when startup config needs to be supplied programmatically before the app is constructed.
- `bootstrapObservabilityFromEnv()`
  Starts observability from environment-driven configuration only. This is the standard entrypoint for service bootstrapping.
- `shutdownObservability()`
  Shuts down the active tracer runtime and clears internal singleton state. Use this for graceful shutdown or test cleanup.
- `isObservabilityEnabled()`
  Returns whether observability is currently active in the bootstrapped runtime.

LoopBack:

- `ObservabilityBindings`
  Provides LoopBack binding keys for DI-bound observability config, runtime, and resolved config.
- `ObservabilityComponent`
  Registers the optional LoopBack integration layer, including config bindings and built-in profile bindings.

Tracing helpers:

- `withSpan()`
  Runs an async function inside a new active span and closes the span automatically when the function completes.
- `addSpanAttributes()`
  Adds attributes to the current active span when one exists.
- `recordException()`
  Records an error on the current span and marks the span status as failed.
- `createPropagationHeaders()`
  Injects the current trace context into a plain header carrier for outbound calls.
- `getTraceContext()`
  Returns the current trace identifiers and propagation headers for correlation or logging.

Config helpers:

- `resolveBootstrapConfig()`
  Resolves startup-critical config from explicit overrides, environment variables, and defaults.
- `resolveComponentConfig()`
  Resolves the LoopBack/component-level config by layering DI enrichment on top of the bootstrapped config.
- `validateObservabilityConfig()`
  Validates that the resolved observability config is coherent before runtime startup.

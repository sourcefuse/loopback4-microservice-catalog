import {context, propagation, trace} from '@opentelemetry/api';

export function createPropagationHeaders(
  carrier: Record<string, string> = {},
): Record<string, string> {
  propagation.inject(context.active(), carrier);
  return carrier;
}

export function getTraceContext(): {
  traceId?: string;
  spanId?: string;
  traceparent?: string;
  tracestate?: string;
} {
  const activeSpan = trace.getSpan(context.active());
  const spanContext = activeSpan?.spanContext();
  const carrier = createPropagationHeaders();

  return {
    traceId: spanContext?.traceId,
    spanId: spanContext?.spanId,
    traceparent: carrier.traceparent,
    tracestate: carrier.tracestate,
  };
}

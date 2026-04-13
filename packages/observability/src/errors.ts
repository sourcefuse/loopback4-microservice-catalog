import {context, SpanStatusCode, trace} from '@opentelemetry/api';
import {AttributeValue} from './types';

export function recordException(
  error: Error,
  attributes?: Record<string, AttributeValue>,
): void {
  const span = trace.getSpan(context.active());
  if (!span) {
    return;
  }

  if (attributes) {
    span.setAttributes(attributes);
  }

  span.recordException(error);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error.message,
  });
}

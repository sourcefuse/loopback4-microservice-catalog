import {context, trace} from '@opentelemetry/api';
import {AttributeValue} from './types';

function getTracer() {
  return trace.getTracer('@sourceloop/observability');
}

export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes?: Record<string, AttributeValue>,
): Promise<T> {
  return getTracer().startActiveSpan(name, async span => {
    if (attributes) {
      span.setAttributes(attributes);
    }

    try {
      return await fn();
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

export function addSpanAttributes(
  attributes: Record<string, AttributeValue>,
): void {
  const span = trace.getSpan(context.active());
  if (!span) {
    return;
  }

  span.setAttributes(attributes);
}

import {strictEqual} from 'assert';
import {SpanStatusCode, trace, Tracer, TracerOptions} from '@opentelemetry/api';
import {withSpan} from '../../tracing';

describe('withSpan', () => {
  it('marks failed spans with error status before rethrowing', async () => {
    const originalGetTracer = trace.getTracer;
    const spanState: {
      status?: {code: SpanStatusCode; message?: string};
      ended: boolean;
      recordedError?: unknown;
    } = {
      ended: false,
    };

    const fakeSpan = {
      end: () => {
        spanState.ended = true;
      },
      recordException: (error: unknown) => {
        spanState.recordedError = error;
      },
      setAttributes: () => undefined,
      setStatus: (status: {code: SpanStatusCode; message?: string}) => {
        spanState.status = status;
      },
    };

    const fakeTracer = {
      startActiveSpan: (
        _name: string,
        arg2: unknown,
        arg3?: unknown,
        arg4?: unknown,
      ) => {
        const callback =
          typeof arg2 === 'function'
            ? arg2
            : typeof arg3 === 'function'
              ? arg3
              : arg4;

        return (callback as (span: typeof fakeSpan) => unknown)(fakeSpan);
      },
    } as unknown as Tracer;

    trace.getTracer = (
      _name: string,
      _version?: string,
      _options?: TracerOptions,
    ) => fakeTracer as Tracer;

    try {
      await withSpan('failing-span', async () => {
        throw new Error('boom');
      }).catch(() => undefined);
    } finally {
      trace.getTracer = originalGetTracer;
    }

    strictEqual(spanState.ended, true);
    strictEqual(spanState.recordedError instanceof Error, true);
    strictEqual(spanState.status?.code, SpanStatusCode.ERROR);
    strictEqual(spanState.status?.message, 'boom');
  });
});

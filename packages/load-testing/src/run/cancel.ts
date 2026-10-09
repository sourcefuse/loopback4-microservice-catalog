// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import os from 'node:os';

const SIGNALS: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];

/**
 * A second signal that comes sooner than this after the first one is
 * ignored. npm forwards the signal to the CLI, so one Ctrl-C can arrive
 * twice within 1 ms. At exactly this time the second signal counts. The
 * clock is monotonic, so a change of the system time cannot extend it.
 */
export const REPEAT_SIGNAL_GRACE_MS = 500;

/**
 * Turns the first SIGINT, SIGTERM or SIGHUP into an abort of `signal`, so
 * that a run can stop and clean up. A second signal ends the process at once,
 * unless it repeats the first one within `REPEAT_SIGNAL_GRACE_MS`.
 */
export class Cancellation {
  private readonly controller = new AbortController();
  private received: NodeJS.Signals | undefined;
  private receivedAtMs = 0;
  private readonly handlers = SIGNALS.map(
    name => [name, () => this.receive(name)] as const,
  );

  readonly signal: AbortSignal = this.controller.signal;

  constructor() {
    for (const [name, handler] of this.handlers) process.on(name, handler);
  }

  /** The exit code that the signal asks for, when a signal came. */
  get exitCode(): number | undefined {
    return this.received && 128 + os.constants.signals[this.received];
  }

  dispose(): void {
    for (const [name, handler] of this.handlers) process.off(name, handler);
  }

  private receive(name: NodeJS.Signals): void {
    if (this.received) {
      if (performance.now() - this.receivedAtMs >= REPEAT_SIGNAL_GRACE_MS) {
        process.exit(this.exitCode);
      }
      return;
    }
    this.received = name;
    this.receivedAtMs = performance.now();
    this.controller.abort();
  }
}

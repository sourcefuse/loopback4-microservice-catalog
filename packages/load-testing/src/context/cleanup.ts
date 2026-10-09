// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/** Collects the cleanups that `ctx.defer` gets, and runs them at the end. */
export class Cleanup {
  private readonly cleanups: Array<() => unknown> = [];

  readonly defer = (cleanup: () => unknown): void => {
    this.cleanups.push(cleanup);
  };

  /**
   * Runs the cleanups, the last one first, so that a row goes before the
   * rows it depends on. A cleanup that fails does not stop the others.
   * Returns what the failed cleanups threw.
   */
  async run(): Promise<unknown[]> {
    const failures: unknown[] = [];
    await this.cleanups
      .splice(0)
      .reverse()
      .reduce(async (previous, cleanup) => {
        await previous;
        try {
          await cleanup();
        } catch (err) {
          failures.push(err);
        }
      }, Promise.resolve());
    return failures;
  }
}

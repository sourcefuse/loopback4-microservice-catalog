// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Turns an unknown throw into something worth reading. `String()` on an object
 * gives `[object Object]`, which hides the detail exactly when it is needed.
 *
 * Deliberately not re-exported from the package root: it explains our own
 * errors and is no use to a consumer.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : JSON.stringify(error);
}

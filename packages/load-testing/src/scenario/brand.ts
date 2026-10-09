// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Objects that the library made: values, requests, steps and groups. The
 * set is private to this module, so no user code can add to it. A plain
 * JSON object with a `kind` field, such as `{kind: 'uuid'}` in a request
 * body, is user data and stays unbranded.
 */
const MADE = new WeakSet<object>();

/** Marks `value` as made by the library, and returns it. */
export function brand<T extends object>(value: T): T {
  MADE.add(value);
  return value;
}

export function isBranded(value: unknown): boolean {
  return typeof value === 'object' && value !== null && MADE.has(value);
}

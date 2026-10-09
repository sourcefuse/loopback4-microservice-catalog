// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {
  Capture,
  RandomNumber,
  RandomString,
  Template,
  Token,
  Uuid,
  Value,
  Var,
} from './types';
import {brand} from './brand';

// Template literals: in a plain string, `${` looks like a forgotten template.
const NOT_A_STRING = `a value cannot go in a plain string: write template\`...\${value}...\``;
const NOT_JSON = `a value cannot go in JSON.stringify: build the text with template\`...\${value}...\``;

/**
 * Makes `toString` and `toJSON` of a value throw. So `${randomString()}` in
 * a plain template literal, or a value in a JSON text such as a filter,
 * fails at once, not as the text `[object Object]` or `{"kind":...}`. The
 * methods are not enumerable, so deep equal does not see them. It also
 * brands the value, so `isValue` does not take a plain object for it.
 */
function guarded<T extends Value>(value: T): T {
  brand(value);
  Object.defineProperties(value, {
    toString: {
      value: () => {
        throw new TypeError(NOT_A_STRING);
      },
    },
    toJSON: {
      value: () => {
        throw new TypeError(NOT_JSON);
      },
    },
  });
  return value;
}

/** Takes `jsonPath` from the response of the earlier request `from`. */
export function captureFrom(from: string, jsonPath: string): Capture {
  return guarded({kind: 'capture', from, jsonPath});
}

/**
 * Takes the value `name` from `vars`: what `before` set for the run, or
 * what `beforeEach` returned for the user. The run stops when neither gives
 * `name`. A text in `vars` must not hold `{{`: Artillery reads it as a
 * template, so the run stops.
 */
export function vars(name: string): Var {
  return guarded({kind: 'var', name});
}

/**
 * The access token of the login user. Use it in a header, for example
 * `` headers: {authorization: template`Bearer ${token()}`} ``.
 */
export function token(): Token {
  return guarded({kind: 'token'});
}

/**
 * `length` random letters and digits, new for each use. With 1,000 vusers and
 * the default length, the chance that two vusers get the same text is about 2 in
 * a billion. Use it where each user needs a name of its own. Put it in
 * `template` to join it with other text.
 */
export function randomString(length = 8): RandomString {
  if (!Number.isSafeInteger(length) || length < 1) {
    throw new TypeError(
      `randomString: the length must be a whole number above 0, not ${length}`,
    );
  }
  return guarded({kind: 'randomString', length});
}

/** True for a safe integer from 0 up. */
function isNonNegativeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

/**
 * A random whole number from `min` to `max`, new for each use. Two vusers can
 * get the same number, so do not use it where each user needs a unique value.
 * `min` and `max` are whole numbers from 0 up. The engine cannot read a
 * negative number in this value.
 */
export function randomNumber(min: number, max: number): RandomNumber {
  if (!isNonNegativeInteger(min) || !isNonNegativeInteger(max)) {
    throw new TypeError(
      'randomNumber: the minimum and the maximum must be whole numbers from 0 up',
    );
  }
  if (min > max) {
    throw new TypeError(
      `randomNumber: the minimum ${min} is above the maximum ${max}`,
    );
  }
  return guarded({kind: 'randomNumber', min, max});
}

/**
 * A UUID of 36 characters, new for each virtual user. It is the same in all
 * the requests of one user, so it also links them. A column with a size limit
 * can be too small for it: use `randomString` there.
 */
export function uuid(): Uuid {
  return guarded({kind: 'uuid'});
}

/**
 * Joins strings, numbers and values into one text, for example
 * `` template`loadtest-${randomString()}-order` ``. The engine fills in the
 * values when a user sends the request. A plain template literal cannot do
 * this: it would call `toString` of the value, which throws.
 *
 * There is no registry of custom values. For a value that the built-in ones
 * cannot make, compute it in a hook (`before`, `beforeEach` or
 * `beforeRequest`), which runs full Node.js, and use it with `vars(name)`.
 */
export function template(
  strings: TemplateStringsArray,
  ...interpolations: (string | number | Value)[]
): Template {
  const parts: (string | Value)[] = [];
  strings.forEach((text, index) => {
    if (text !== '') parts.push(text);
    if (index < interpolations.length) {
      const item = interpolations[index];
      parts.push(typeof item === 'number' ? String(item) : item);
    }
  });
  return guarded({kind: 'template', parts});
}

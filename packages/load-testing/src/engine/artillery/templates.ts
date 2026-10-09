// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {RunError} from '../../errors';
import {OPEN_BRACES} from '../../scenario/braces';
import type {Vars} from '../../types';

/**
 * The texts that the engine reads in a value. Artillery fills a template
 * with `String.replace`, so `$&`, `` $` `` and `$'` in a value also work as
 * patterns, and such a value makes the fill loop never end. `$$` gives one
 * `$`, so the engine sends a changed value.
 */
export const TEMPLATE_PATTERNS: readonly string[] = [
  OPEN_BRACES,
  '$&',
  '$`',
  "$'",
  '$$',
];

/** Names the texts of `TEMPLATE_PATTERNS` in a message. */
const TEMPLATE_PATTERNS_TEXT = `"${OPEN_BRACES}", "$&", "$\`", "$'" or "$$"`;

/** Ends the message about a var that holds a text of `TEMPLATE_PATTERNS`. The path starts it. */
export const TEMPLATE_VARS_MESSAGE = ` contains text that the engine reads as a template (${TEMPLATE_PATTERNS_TEXT}). Put the value in vars without it, or leave it out.`;

/**
 * Starts the message about a captured value that holds a text of
 * `TEMPLATE_PATTERNS`. The cause comes first, because Artillery cuts a long
 * error text in its summary.
 */
export const TEMPLATE_CAPTURE_START = `${TEMPLATE_PATTERNS_TEXT} in the value of `;

/**
 * Ends the message about a captured value that holds a text of
 * `TEMPLATE_PATTERNS`. The endpoint id and the JSON path come before it.
 */
export const TEMPLATE_CAPTURE_MESSAGE = `. The engine reads it as a template. The vuser stopped before it sent another request.`;

/** Ends the message about a token that holds a text of `TEMPLATE_PATTERNS`. */
export const TEMPLATE_TOKEN_MESSAGE = ` contains text that the engine reads as a template (${TEMPLATE_PATTERNS_TEXT}). Log in again to get another token.`;

/** True when the engine reads `text` as a template. */
export function readsAsTemplate(text: string): boolean {
  return TEMPLATE_PATTERNS.some(pattern => text.includes(pattern));
}

/**
 * JavaScript source of `loadTestsReadsAsTemplate` and `loadTestsTemplateAt`
 * for the generated processor. They do what `readsAsTemplate` and
 * `templateAt` do. A worker cannot import this file, so it gets a copy as
 * text, with its own list of patterns. Nothing here may use a name from
 * outside.
 */
export const TEMPLATE_AT_SOURCE = `
const loadTestsReadsAsTemplate = text =>
  ${JSON.stringify(TEMPLATE_PATTERNS)}.some(pattern => text.includes(pattern));
const loadTestsTemplateAt = (value, path) => {
  if (typeof value === 'string') {
    return loadTestsReadsAsTemplate(value) ? path : undefined;
  }
  if (typeof value !== 'object' || value === null) return undefined;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = loadTestsTemplateAt(value[i], path + '[' + i + ']');
      if (found !== undefined) return found;
    }
    return undefined;
  }
  for (const [key, item] of Object.entries(value)) {
    const at = path + '.' + key;
    if (loadTestsReadsAsTemplate(key)) return at;
    const found = loadTestsTemplateAt(item, at);
    if (found !== undefined) return found;
  }
  return undefined;
};`;

/**
 * Returns the path of the first text in `value` that holds a text of
 * `TEMPLATE_PATTERNS`, or undefined. It reads strings, arrays, and the
 * values and the keys of objects. Artillery expands such a text again after
 * it fills a template.
 */
export function templateAt(value: unknown, path: string): string | undefined {
  if (typeof value === 'string') {
    return readsAsTemplate(value) ? path : undefined;
  }
  if (typeof value !== 'object' || value === null) return undefined;
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const found = templateAt(item, `${path}[${index}]`);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  for (const [key, item] of Object.entries(value)) {
    const at = `${path}.${key}`;
    if (readsAsTemplate(key)) return at;
    const found = templateAt(item, at);
    if (found !== undefined) return found;
  }
  return undefined;
}

/**
 * Stops the run when a var of `before` holds a text of `TEMPLATE_PATTERNS`.
 * Artillery would expand it in each request that uses the var, and a var
 * that holds itself would never end. It checks the JSON text that the
 * processor will hold: a `toJSON` result counts, a cycle throws a TypeError,
 * and a value `undefined` is skipped.
 */
export function checkRunVars(runVars: Vars): void {
  const written: unknown = JSON.parse(JSON.stringify(runVars));
  const found = templateAt(written, 'vars');
  if (found !== undefined) {
    throw new RunError(`${found}${TEMPLATE_VARS_MESSAGE}`);
  }
}

/**
 * Stops the run when the access token holds a text of `TEMPLATE_PATTERNS`.
 * Artillery reads the token as `{{ $env.LOAD_TESTS_TOKEN }}` and would expand
 * it in the same way.
 */
export function checkToken(token: string | undefined): void {
  if (token !== undefined && readsAsTemplate(token)) {
    throw new RunError(`The access token${TEMPLATE_TOKEN_MESSAGE}`);
  }
}

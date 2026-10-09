// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {LoadRequest, ParallelGroup, RawStep} from '../types';
import type {Template, Value} from './types';
import {isBranded} from './brand';

const VALUE_KINDS = new Set([
  'capture',
  'var',
  'token',
  'randomString',
  'randomNumber',
  'uuid',
  'template',
]);

/** True for an object made with `{}`, `Object.create(null)` or `Object.create(Object.prototype)`. */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Every request in the flow, also inside raw steps and parallel groups, in
 * document order.
 */
export function requestsIn(value: unknown): LoadRequest[] {
  if (isRequest(value)) return [value];
  if (isRaw(value)) return requestsIn(value.step);
  if (isParallel(value)) return value.requests;
  if (Array.isArray(value)) return value.flatMap(requestsIn);
  if (isPlainObject(value)) {
    return Object.values(value).flatMap(requestsIn);
  }
  return [];
}

export function isRequest(value: unknown): value is LoadRequest {
  return isBranded(value) && (value as LoadRequest).kind === 'request';
}

export function isRaw(value: unknown): value is RawStep {
  return isBranded(value) && (value as RawStep).kind === 'raw';
}

export function isParallel(value: unknown): value is ParallelGroup {
  return isBranded(value) && (value as ParallelGroup).kind === 'parallel';
}

export function isTemplate(value: unknown): value is Template {
  return isBranded(value) && (value as Template).kind === 'template';
}

/** True for every value that the library made: a capture, a var, a template, ... */
export function isValue(value: unknown): value is Value {
  return isBranded(value) && VALUE_KINDS.has((value as Value).kind);
}

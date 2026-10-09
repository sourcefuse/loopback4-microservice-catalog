// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {HeaderMap} from './types';

/**
 * Joins two sets of headers. A name is the same when it has the same
 * letters, whatever their case, because HTTP header names ignore case. The
 * stronger set wins, and its spelling of the name stays.
 */
export function mergeHeaders(
  weaker: HeaderMap | undefined,
  stronger: HeaderMap | undefined,
): HeaderMap {
  const overridden = new Set(
    Object.keys(stronger ?? {}).map(name => name.toLowerCase()),
  );
  const kept = Object.entries(weaker ?? {}).filter(
    ([name]) => !overridden.has(name.toLowerCase()),
  );
  return {...Object.fromEntries(kept), ...stronger};
}

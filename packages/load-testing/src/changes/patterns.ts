// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import path from 'node:path';

/**
 * Returns what is wrong with a list of file patterns, for `covers` and
 * `runAllWhen`. A pattern is relative to the workspace root and stays inside
 * it. `where` starts each message.
 */
export function patternProblems(patterns: unknown, where: string): string[] {
  if (patterns === undefined) return [];
  if (!Array.isArray(patterns)) {
    return [`${where} must be a list of patterns, for example ['src/**']`];
  }
  return patterns.flatMap((pattern, index) => {
    const at = `${where}[${index}]`;
    if (typeof pattern !== 'string' || pattern === '') {
      return [`${at} must be a pattern that is not empty`];
    }
    if (path.isAbsolute(pattern) || pattern.startsWith('!')) {
      return [
        `${at} must be relative to the root, with no leading ! : ${pattern}`,
      ];
    }
    return pattern.split(/[\\/]/).includes('..')
      ? [`${at} must stay inside the root: ${pattern}`]
      : [];
  });
}

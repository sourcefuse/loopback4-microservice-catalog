// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ICachedMethodOptions} from '../types';

/**
 * Helper function to add tags to cached method options.
 * Merges provided tags with any existing tags in the options.
 * @param options - The cached method options to augment
 * @param tags - Additional tags to add
 * @returns The updated options object
 */
export function addTagsToOptions(
  options?: ICachedMethodOptions,
  tags?: string[],
): ICachedMethodOptions {
  if (!options) {
    options = {};
  }
  if (tags?.length) {
    options.tags = (options.tags ?? []).concat(tags);
  }
  return options;
}

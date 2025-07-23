import {ArtifactOptions, Booter} from '@loopback/boot';
import {Constructor, injectable} from '@loopback/core';
import {randomBytes} from 'crypto';

// Extend ArtifactOptions with a `key` identifier
export interface BooterOptionsWithKey extends ArtifactOptions {
  interface?: string;
}
function generateRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(bytes[i] % chars.length);
  }
  return result;
}
const KEY_LENGTH = 5;
/**
 * Mixin to override `projectRoot` and `options` based on a given base path.
 *
 * @param BooterClass The booter class to extend
 * @param basePath The base path to be used as `projectRoot`
 * @param defaultOptions Default options to merge with user config
 */
// sonarignore-next-line
export function BooterBasePathMixin<T extends Constructor<Booter>>(
  booterClass: T,
  basePath: string,
  defaultOptions: BooterOptionsWithKey,
): T {
  @injectable({
    tags: {
      key: `${booterClass.name}_${defaultOptions.interface}_${generateRandomString(KEY_LENGTH)}`,
    },
  })
  class NewClass extends booterClass {
    projectRoot = basePath;
    options = {...defaultOptions};
  }
  return NewClass as T;
}

import {CacheMethod, ICachedService} from '../types';

/**
 * This is a TypeScript function that invalidates cache items based on specified tags.
 * @param {string[]} tags - An optional array of strings that represent tags associated with the cached
 * data. These tags can be used to selectively invalidate cached data.
 * @returns The function `cacheInvalidator` is being returned.
 */
export function cacheInvalidator<T extends ICachedService>(
  tags: string[] = [],
) {
  return <S>(
    target: T,
    methodName: string,
    descriptor: TypedPropertyDescriptor<CacheMethod<S>>,
  ): TypedPropertyDescriptor<CacheMethod<S>> => {
    if (!(descriptor?.value instanceof Function)) {
      throw Error(`'@cachedItem' can be applied only to the class methods`);
    }

    const originalMethod = descriptor.value;
    // sonarignore:start
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]): Promise<any> {
      // sonarignore:end
      const {cache, cacheIdentifier} = this as ICachedService;
      const prefix = cacheIdentifier ?? target.constructor.name;
      cache
        .invalidate(prefix, tags)
        .catch(err => cache.logger.error(err.message));
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

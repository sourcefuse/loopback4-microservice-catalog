import {CacheMethod, ICachedService} from '../types';

/**
 * This is a TypeScript decorator function that caches the result of a method call and retrieves it
 * from the cache if available, otherwise it calls the original method and saves the result in the
 * cache.
 * @param {string[]} tags - The `tags` parameter is an optional array of strings that can be passed to
 * the `cachedItem` decorator function. These tags can be used to group cached items together and make
 * it easier to invalidate or clear a specific group of cached items.
 * @returns The `cachedItem` function returns a decorator function that can be used to decorate a class
 * method with caching functionality.
 */
export function cachedItem<T extends ICachedService>(
  tags: string[] = [],
  ignoredParamIndexes: number[] = [],
) {
  return <S>(
    target: T,
    methodName: string,
    descriptor?: TypedPropertyDescriptor<CacheMethod<S>>,
  ): TypedPropertyDescriptor<CacheMethod<S>> => {
    if (!(descriptor?.value instanceof Function)) {
      throw Error(`'@cachedItem' can be applied only to the class methods`);
    }

    const originalMethod = descriptor.value;
    // sonarignore:start
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]): Promise<S> {
      // sonarignore:end
      const {cache, cacheIdentifier} = this as ICachedService;
      const prefix = cacheIdentifier ?? target.constructor.name;
      const filteredArgs = ignoredParamIndexes.length
        ? args.filter((_, index) => !ignoredParamIndexes.includes(index))
        : args;
      const cacheKey = cache.buildKey(...filteredArgs, methodName);
      const inCache = await cache.getFromCache<S>(prefix, cacheKey, tags);
      if (inCache) {
        return inCache;
      } else {
        const result = await originalMethod.apply(this, args);
        cache
          .saveInCache(prefix, cacheKey, tags, result)
          .catch(err => cache.logger.error(err.message));
        return result;
      }
    };

    return descriptor;
  };
}

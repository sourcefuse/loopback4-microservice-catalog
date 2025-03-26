import {BindingScope, Context, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {createHash} from 'crypto';
import {DEFAULT_CACHE_OPTIONS} from '../constants';
import {AUTH_USER_KEY, CacheComponentBindings} from '../keys';
import {
  CacheMethod,
  ICacheComponentOptions,
  ICacheOptions,
  ICacheService,
  ICacheStore,
  ICachedMethodOptions,
} from '../types';

@injectable({
  scope: BindingScope.TRANSIENT,
})
export class CacheService implements ICacheService {
  private readonly deletionMarkerPrefix = 'deletion-marker-';
  private readonly insertionMarkerPrefix = 'insertion-marker-';
  private readonly store: ICacheStore;
  // refer this - https://gist.github.com/saitonakamura/d51aa672c929e35cc81fa5a0e31f12a9
  private readonly replacer = (val: AnyObject, cache?: WeakSet<AnyObject>) => {
    cache = cache ?? new WeakSet();

    if (val && typeof val == 'object') {
      if (cache.has(val)) return '[Circular]';

      cache.add(val);

      const obj = (Array.isArray(val) ? [] : {}) as AnyObject;
      for (const idx in val) {
        obj[idx] = this.replacer(val[idx], cache);
      }

      cache.delete(val);
      return obj;
    }

    return val;
  };
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
    @inject.context()
    private readonly context: Context,
    @inject(CacheComponentBindings.CacheConfig)
    private readonly configuration: ICacheComponentOptions &
      typeof DEFAULT_CACHE_OPTIONS,
    @inject(AUTH_USER_KEY, {optional: true})
    private readonly user?: IAuthUserWithPermissions,
  ) {
    configuration = {
      ...DEFAULT_CACHE_OPTIONS,
      ...configuration,
    };
    this.store = context.getSync<ICacheStore>(
      `services.${configuration.strategy.name}`,
    );
  }

  /**
   * This is an async function that saves a value in cache with a given prefix, key, tags, and options.
   * @param {string} prefix - A string that will be used as a prefix for the cache key. This can be used
   * to group related cache entries together.
   * @param {string} key - The key is a string that represents the unique identifier for the cached data.
   * It is used to retrieve the data from the cache later.
   * @param {string[]} tags - An array of strings that represent tags associated with the cached value.
   * These tags can be used to group and retrieve cached values later.
   * @param {T} value - The value to be saved in the cache. It can be of any type, as the function is
   * generic and can handle any type of value.
   * @param {ICacheOptions} [options] - ICacheOptions is an optional parameter that can be passed to the
   * function. It is an interface that defines the following properties:
   */
  async saveInCache<T>(
    prefix: string,
    key: string,
    tags: string[],
    value: T,
    options?: ICacheOptions,
  ): Promise<void> {
    const saveKey = this.buildKey(prefix, tags, key);
    let ttl = this.configuration.ttl;
    if (options?.ttl) {
      ttl = options.ttl;
    }
    await this.store.set(saveKey, value, ttl);
    await this.saveInsertionTimes(saveKey);
  }

  /**
   * This is an asynchronous function that retrieves data from a cache based on a prefix, key, and tags.
   * @param {string} prefix - A string that serves as a prefix for the cache key. This helps to organize
   * and differentiate cached data for different purposes or components.
   * @param {string} key - The key is a string that is used to identify the cached data. It is used along
   * with the prefix and tags to build a unique key for the cached data. When retrieving data from the
   * cache, the key is used to look up the cached data.
   * @param {string[]} tags - The `tags` parameter is an array of strings that are used to group related
   * cache entries together. This allows for efficient invalidation of multiple cache entries at once by
   * simply invalidating all entries with a certain tag.
   * @returns a Promise that resolves to a value of type `T` or `undefined`. The type `T` is a generic
   * type that can be any type specified by the caller of the function.
   */
  async getFromCache<T>(
    prefix: string,
    key: string,
    tags: string[],
  ): Promise<T | undefined> {
    const saveKey = this.buildKey(prefix, tags, key);
    const isValid = await this.verifyInsertionTime(prefix, saveKey, tags);
    if (!isValid) {
      return undefined;
    }
    return this.store.get(saveKey);
  }

  /**
   * This is an async function that executes a given function, saves the result in cache, and returns the
   * result.
   * @param fn - `fn` is a function that will be executed and its result will be cached. It is of type
   * `CacheMethod<T>`, which means it is a function that returns a Promise of type `T`.
   * @param {any[]} args - args is an array of arguments that will be passed to the function being
   * executed and cached.
   * @param {string} methodName - The name of the method being executed and saved in cache.
   * @param {string} prefix - The prefix parameter is a string that is used as a prefix for the cache
   * key. It helps to differentiate between different types of cached data and avoid key collisions.
   * @param {ICachedMethodOptions} [options] - `options` is an optional parameter of type
   * `ICachedMethodOptions` which contains additional options for the cached method. It can include a
   * `forceUpdate` boolean flag to indicate whether the cached value should be ignored and the method
   * should be executed again, and a `tags` array to specify tags
   * @param {ICacheOptions} [cacheOptions] - `cacheOptions` is an optional parameter of type
   * `ICacheOptions` that can be passed to the `executeAndSave` method. It is used to specify additional
   * options for caching the result of the method call. These options can include things like the
   * expiration time for the cached value,
   * @returns The function `executeAndSave` returns a Promise of type `T`.
   */
  async executeAndSave<T>(
    fn: CacheMethod<T>,
    // sonarignore:start
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    // sonarignore:end
    methodName: string,
    prefix: string,
    options?: ICachedMethodOptions,
    cacheOptions?: ICacheOptions,
  ): Promise<T> {
    const key = this.buildKey(...args, methodName);
    if (!options?.forceUpdate) {
      const cachedValue = await this.getFromCache<T>(
        prefix,
        key,
        options?.tags ?? [],
      ).catch(err => {
        this.logger.error(err.message);
        return null;
      });
      if (cachedValue) {
        return cachedValue;
      }
    }
    const result = await fn(...args);
    this.saveInCache(
      prefix,
      key,
      options?.tags ?? [],
      result,
      cacheOptions,
    ).catch(err => this.logger.error(err.message));
    return result;
  }

  /**
   * The function takes in any number of arguments, converts them to JSON strings, concatenates them with
   * underscores, hashes the resulting string using SHA256 algorithm, and returns the hash value as a
   * string.
   * @param {any[]} args - args is a rest parameter that allows the function to accept an indefinite
   * number of arguments. These arguments can be of any data type.
   * @returns The `buildKey` function is returning a string that is the SHA-256 hash of the concatenated
   * stringified values of all the arguments passed to the function, separated by underscores.
   */
  // sonarignore:start
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildKey(...args: any[]): string {
    let rawKey = args.map(r => JSON.stringify(this.replacer(r))).join('_');
    if (this.user?.tenantId) {
      rawKey = `${this.user.tenantId}_${rawKey}`;
    }
    // sonarignore:end
    return createHash('sha256').update(rawKey).digest('hex');
  }

  /**
   * This function invalidates cache entries based on a given prefix and tags.
   * @param {string} prefix - The prefix parameter is a string that represents the prefix of the cache
   * keys that need to be invalidated.
   * @param {string[]} tags - The `tags` parameter is an array of strings representing the tags that need
   * to be invalidated. These tags are used to identify cached data that needs to be removed.
   */
  async invalidate(prefix: string, tags: string[]): Promise<void> {
    const prefixDeletion = this.invalidatePrefix(prefix);
    const tagDeletions = this.invalidateTags(tags);
    await this.store.setMany([prefixDeletion, ...tagDeletions]);
  }

  /**
   * This function removes invalidatations of cache entries based on a given prefix and tags.
   * @param {string} prefix - The `prefix` parameter is a string that is used to identify a group of
   * items that need to be uninvalidated.
   * @param {string[]} [tags] - The `tags` parameter in the `uninvalidate` method is an optional
   * parameter of type `string[]`. It is an array of strings that represent tags that were invalidated. If
   * this parameter is provided when calling the method, the corresponding tags will be uninvalidated along
   * with the specified prefix. If the `
   */
  private async uninvalidate(prefix: string, tags?: string[]): Promise<void> {
    const prefixDeletion = this.invalidatePrefix(prefix);
    let tagDeletions: [string, number, number][] = [];
    if (tags) {
      tagDeletions = this.invalidateTags(tags);
    }
    await this.store.deleteMany([
      prefixDeletion[0],
      ...tagDeletions.map(record => record[0]),
    ]);
  }

  private invalidatePrefix(prefix: string): [string, number, number] {
    const deletionKey = this.buildKey(this.deletionMarkerPrefix, prefix);
    return [deletionKey, Date.now(), this.configuration.ttl];
  }

  private invalidateTags(tags: string[]): [string, number, number][] {
    const now = Date.now();
    return tags.map(tag => [
      this.buildKey(this.deletionMarkerPrefix, tag),
      now,
      this.configuration.ttl,
    ]);
  }

  private saveInsertionTimes(key: string) {
    const insertionKey = this.buildKey(this.insertionMarkerPrefix, key);
    const insertionValue = Date.now();
    return this.store.set(insertionKey, insertionValue, this.configuration.ttl);
  }

  private async verifyInsertionTime(
    prefix: string,
    key: string,
    tags: string[],
  ) {
    const insertionKey = this.buildKey(this.insertionMarkerPrefix, key);
    const deletionKey = this.buildKey(this.deletionMarkerPrefix, prefix);
    const tagKeys = tags.map(tag =>
      this.buildKey(this.deletionMarkerPrefix, tag),
    );
    const [insertionValue, deletionValue, ...tagDeletionTimes] =
      await this.store.getMany<number>([insertionKey, deletionKey, ...tagKeys]);
    if (!insertionValue) {
      return false;
    }
    if (tagDeletionTimes.some(t => t && t >= insertionValue)) {
      return false;
    }
    if (!deletionValue) {
      return true;
    }
    if (deletionValue >= insertionValue) {
      return false;
    }
    return true;
  }
}

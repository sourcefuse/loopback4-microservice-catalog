import {ILogger} from '@sourceloop/core';
import {Constructor} from '@loopback/core';
import {Entity, Filter} from '@loopback/repository';

/* `ICacheComponentOptions` is an interface that extends `ICacheOptions` and adds two additional
properties:
- `datasourceName`: An optional string property that specifies the name of the datasource to be used
for caching. It should not have the 'datasources' prefix.
- `strategy`: A required property that specifies the constructor of the caching strategy to be used.
The caching strategy must implement the `ICacheStore` interface. */
export interface ICacheComponentOptions extends ICacheOptions {
  datasourceName?: string;
  strategy: Constructor<ICacheStore>;
}

/* `export interface ICacheOptions` is defining an interface for the options that can be passed to a
caching mechanism. It has three optional properties:
- `ttl`: Time to live for the cached item in seconds.
- `invalidationTags`: An array of tags that can be used to invalidate cached items on update/create/delete operations.
- `cachedItemTags`: An array of tags that can be used to tag cached items. */
export interface ICacheOptions {
  ttl?: number;
}

export interface ICacheMixinOptions extends ICacheOptions {
  invalidationTags?: string[];
  cachedItemTags?: string[];
  disableCachedFetch?: boolean;
}

/* `ICachedMethodOptions` is an interface that defines the options that can be passed to a cached
method. It has two properties:
- `forceUpdate`: A boolean value that indicates whether the cached item should be updated even if it
exists in the cache.
- `tags`: An optional array of tags that can be used to tag the cached item. These tags can be used
to invalidate cached items on update/create/delete operations. */
export interface ICachedMethodOptions {
  forceUpdate?: boolean;
  tags?: string[];
}

/* `export interface ICachedService` is defining an interface for a service that uses caching. It has
two properties:
- `cache`: An instance of `ICacheService` that will be used for caching.
- `cacheIdentifier`: An optional string property that can be used to identify the cache used by the
service.If not provided, class name of the service/controller would be used */
export interface ICachedService {
  cache: ICacheService;
  cacheIdentifier?: string;
}

export interface ICacheService {
  logger: ILogger;
  // sonarignore:start
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildKey(...args: any[]): string;
  // sonarignore:end
  getFromCache<T>(
    prefix: string,
    key: string,
    tags: string[],
  ): Promise<T | undefined>;
  saveInCache<T>(
    prefix: string,
    key: string,
    tags: string[],
    value: T,
    options?: ICacheOptions,
  ): Promise<void>;
  invalidate(prefix: string, tags: string[]): Promise<void>;
  executeAndSave<T>(
    fn: CacheMethod<T>,
    // sonarignore:start
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    // sonarignore:end
    methodName: string,
    prefix: string,
    options?: ICachedMethodOptions,
    cacheOptions?: ICacheOptions,
  ): Promise<T>;
}

export interface ICacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  getMany<T>(keys: string[]): Promise<(T | undefined)[]>;
  setMany<T>(keys: [string, T, number][]): Promise<void>;
  delete(key: string): Promise<void>;
  deleteMany(keys: string[]): Promise<void>;
}

export interface ICachedRepository<E extends Entity, ID, R extends Object> {
  find(filter?: Filter<E>, options?: ICachedMethodOptions): Promise<(E & R)[]>;
  findById(
    id: ID,
    filter?: Filter<E>,
    options?: ICachedMethodOptions,
  ): Promise<E & R>;
  findOne(
    filter?: Filter<E>,
    options?: ICachedMethodOptions,
  ): Promise<(E & R) | null>;
}

// sonarignore:start
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CacheMethod<T> = (...args: any[]) => Promise<T>;
// sonarignore:end

// sonarignore:start
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
// sonarignore:end

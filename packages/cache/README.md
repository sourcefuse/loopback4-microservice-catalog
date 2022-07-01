# @sourceloop/cache

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/cache)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/cache)

![npm dev dependency version](https://img.shields.io/npm/dependency-version/@sourceloop/cache/dev/@loopback/core)

## Overview

Caching can prove to be quite beneficial in improving application efficency and performance by storing a subset of data in high speed data storage layer. Some benefits that cache can provide:

- It allows you to efficiently reuse previously retrieved or computed data.
- It reduces latency.
- It helps to avoids network congestion.
- In the event of outages, it can save the day by serving end users with the cached content.

However, cache can't be used anywhere. You must consider the following:

- It is only beneficial in case same data is frequently requested (i.e. cache hit rate should be high). If this is not the case then caching will prove to be an overhead for your application
- In case of caching editable data, you must be prepared to receive stale data from cache. However, you can configure the ttl according to whatever is acceptable for your application.

`@sourceloop/cache` provides a configurable way in which you can apply caching in loopback. The package exposes a mixin for loopback's DefaultCrudRepository. The mixin overrides the find and findById methods for the DefaultCrudRepository. The added functionality helps in caching GET request responses using Redis.

## Installation

```sh
npm i @sourceloop/cache
```

Note: This package has loopback-connector-kv-redis as a peer dependency and only works with Redis for now

## Basic Use

Configure and load CachePluginComponent in the application constructor
as shown below.

```ts
import {
  CachePluginComponent,
  CachePluginComponentOptions,
  DEFAULT_CACHE_PLUGIN_OPTIONS,
  CachePluginComponentBindings,
} from '@sourceloop/cache';
// ...
export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // ...
    const opts: CachePluginComponentOptions = {
      cacheProvider: CacheStrategyTypes.Redis,
      prefix: process.env.CACHE_PREFIX ?? DEFAULT_CACHE_PLUGIN_OPTIONS.prefix,
    };
    this.configure(CachePluginComponentBindings.COMPONENT).to(opts);
    this.component(CachePluginComponent);
    // ...
  }
  // ...
}
```

As shown above, you can configure the cache properties at a Global level. You can also provide these properties at the repository level. Options passed at the repository level will override the global options.

The following cache options can be passed:

| Property                   | Default Value | Description                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prefix                     | "sl"          | every cached entry is required to have a prefix in its key. Each repository should have their own unique prefix.                                                                                                                                                                                                                                                 |
| ttl                        | 60000         | this is the maximum time in milliseconds for which data will remain cached in redis. In other words this can be called the amount of time for which stale data is acceptable.                                                                                                                                                                                    |
| scanCount (only for redis) | 50            | while clearing the cache using clearCache() function provided, all the keys beginning with the prefix are searched for using the SCAN command. This command can take an additoinal paramter COUNT (here refered to as scanCount) - this is the number of elements returned/deleted at a time. As it is only for redis you can't pass this at the component level |

<br>

To use the caching functionality, you simply need to extend your repository with the CacheRespositoryMixin provided. You must inject the getter of the cache datasource with variable name getCacheDataSource.

```ts
export class ProductRepository extends CacheManager.CacheRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  ProductRelations,
  Constructor<
    DefaultCrudRepository<
      Product,
      typeof Product.prototype.id,
      ProductRelations
    >
  >
>(DefaultCrudRepository, {
  prefix: 'product',
  ttl: 50000,
}) {
  redisDataSource: RedisDataSource;
  constructor(
    @inject('datasources.expt') dataSource: ExptDataSource,
    @inject.getter('datasources.CacheDB')
    public getCacheDataSource: Getter<RedisDataSource>,
  ) {
    super(Product, dataSource);
  }
}
```

- If you want entries in the cache to be forcefully updated, you can set forceUpdate true in options while invoking find/findById. Forcefully update will always return data from the original source and update the cache with the new data.

  ```ts
  this.productRepository.findById(3, {}, {forceUpdate: true});
  ```

  On updating forcefully the ttl gets reset.

- There is also a way to delete all cache entries for a repository. To do so you can use the clear cache function:
  ```ts
  this.productRepository.clearCache();
  ```
  It uses the repository prefix to find matching entries to delete.
  <br>
  <br>

> _NOTE : The caching is implemented as a key value pair. The key is of the form `prefix_id_filter`. The format of the key plays a very important role in the cache hit ratio. For example: Consider a situation in which you are sending user id in filter with every request. This will generate a new key for every user. So even if same data is returned to all users, caching will not be beneficial until and unless the same user makes the same request multiple times._

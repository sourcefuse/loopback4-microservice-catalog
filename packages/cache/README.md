# @sourceloop/cache

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

Caching can prove to be quite beneficial in improving application efficency and performance by storing a subset of data in high speed data storage layer. Caching allows you to efficiently reuse previously retrieved or computed data. It reduces latency and at the same time avoids network congestion. Also, in the event of outages, caching can save the day by serving end users with the cached content.

However, caching will only prove to be beneficial if same data is frequently requested. You must consider this as a prime factor before you dive into caching. A successful cache results in a high hit rate. If same data is not requested mutliple times then it will just prove to be an overhead for your application. Also, if data does not remain static (i.e. it is edited several times) it might be a little tricky to use cache in those cases. In such cases the user must consider to maintain an effective balance between stale and new data by configuring the ttl (time to live) according to the application acceptance standards.

This package provides a configurable way in which you can apply caching. The package exposes a mixin for loopback's DefaultCrudRepository. The provided mixins overrides the find and findById methods for the DefaultCrudRepository. The added functionality helps in caching GET request responses using Redis.

## Installation

```sh
npm i @sourceloop/cache
```

Note: This package has loopback-connector-kv-redis as a peer dependency and only works with Redis for now

## Basic Use

Configure and load CachePluginComponent in the application constructor
as shown below.

```ts
import {CachePluginComponent, CachePluginComponentOptions, DEFAULT_CACHE_PLUGIN_OPTIONS} from '@sourceloop/cache';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: CachePluginComponentOptions = DEFAULT_CACHE_PLUGIN_OPTIONS;
    this.configure(CachePluginComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(CachePluginComponent);
    // ...
  }
  // ...
}
```

## Usage

The caching is implemented in redis as a key value pair. The key is of the form `prefix_id_filter`. To shorten the key length it is then hashed.
The format of the key plays a very important role in the cache hit ratio. Consider a situation in which you are sending user id in filter with every request. This will generate a new key for every user. So even if same data is returned to all users, caching will not be beneficial until and unless the same user makes the same request multiple times. So it is very important that you consider this format while using this package.

To use the caching functionality, you simply need to extend your repository with the CacheRespositoryMixin provided. While extending you can provide the following options:

- prefix - every cached entry is required to have a prefix in its key. Each repository should have their own unique prefix.

- ttl - this is the maximum time in milliseconds for which data will remain cached in redis. In other words this can be called the amount of time for which stale data is acceptable. Default value is 60000.

- scanCount - while clearing the cache using clearCache() function provided, all the keys beginning with the prefix are searched for using the SCAN command. This command can take an additoinal paramter COUNT (here refered to as scanCount) - this is the number of elements returned/deleted at a time. Default value is 50.

- salt - the key which is used in redis is hashed to make it small in length. For that purpose you can provide your own salt string using this. Be sure that the salt you provide is acceptable to the bcrypt library hash function.

All the above properties are optional. However, it is recommended that you atleast provide prefix, ttl and salt.
There is also an option to delete all cache entries for a repository. For doing this you can use the clearCache() function. This will delete all cache entries for that repository. It uses the repository prefix to find matching entries to delete. The function also returns the number of matching entries deleted from cache.

If you want entries in the cache to be forcefully updated, you can set forceUpdate true in options while invoking find/findById.
Forcefully update will always return data from the original source and update the cache with the new data.

```
this.productRepository.findById(3,{},{forceUpdate:true})
```

On updating forcefully the ttl gets reset.

### Configuring Datasource

The redis datasource can be bound to any key. However, it is required that you inject the getter of the datasource into the repository on which mixin is to be applied. For this, you must provide getCacheDataSource as variable name for the injected getter for the datasource.

An example of using the cache mixin:

```ts
export class ProductRepository extends CacheManager.CacheRespositoryMixin<
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

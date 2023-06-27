<a href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="_blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" alt="ARC By SourceFuse logo" title="ARC By SourceFuse" align="right" width="150" /></a>

# [@sourceloop/cache](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/packages/cache)

<p align="left">
<a href="https://www.npmjs.org/package/@sourceloop/cache">
<img src="https://img.shields.io/npm/v/@sourceloop/cache.svg" alt="npm version" />
</a>
<a href="https://github.com/sourcefuse/loopback4-microservice-catalog/graphs/contributors" target="_blank">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/sourcefuse/loopback4-microservice-catalog">
</a>
<a href="https://www.npmjs.com/@sourceloop/cache" target="_blank">
<img alt="sourceloop cache downloads" src="https://img.shields.io/npm/dm/@sourceloop/cache">
</a>
<a href="./LICENSE">
<img src="https://img.shields.io/github/license/sourcefuse/loopback4-microservice-catalog" alt="License" />
</a>
<a href="https://loopback.io/" target="_blank">
<img alt="Pb Loopback" src="https://img.shields.io/badge/Powered%20by-Loopback 4-brightgreen" />
</a>
</p>

## Overview

The `@sourceloop/cache` package offers a flexible solution for implementing caching in LoopBack. It introduces a mixin for LoopBack's [DefaultCrudRepository](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.html) and [SequelizeCrudRepository](https://loopback.io/doc/en/lb4/apidocs.sequelize.sequelizecrudrepository.html), allowing you to configure caching behavior. This mixin extends and overrides the `find`, `findById`, and `findOne` methods of the target repository. By leveraging [Redis](https://redis.io) as the caching datasource, it enables the caching of GET request responses.

## Philosophy

Caching can prove to be quite beneficial in improving application efficency and performance by storing a subset of data in high speed data storage layer. Some benefits that cache can provide:

- It allows you to efficiently reuse previously retrieved or computed data.
- It reduces latency.
- It helps to avoids network congestion.
- In the event of outages, it can save the day by serving end users with the cached content.

However, cache can't be used anywhere. You must consider the following:

- It is only beneficial in case same data is frequently requested (i.e. cache hit rate should be high). If this is not the case then caching will prove to be an overhead for your application
- In case of caching editable data, you must be prepared to receive stale data from cache. However, you can configure the ttl according to whatever is acceptable for your application.

## Installation

```sh
npm i @sourceloop/cache
```

Note: This package has [loopback-connector-kv-redis](https://www.npmjs.com/package/loopback-connector-kv-redis) as a peer dependency and only works with Redis for now.

## Usage

### Component Binding

Configure and bind `CachePluginComponent` to the application constructor as shown below.

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
    const cacheOptions: CachePluginComponentOptions = {
      cacheProvider: CacheStrategyTypes.Redis,
      prefix: process.env.CACHE_PREFIX ?? DEFAULT_CACHE_PLUGIN_OPTIONS.prefix,
      ttl: 3000,
    };
    this.configure(CachePluginComponentBindings.COMPONENT).to(cacheOptions);
    this.component(CachePluginComponent);
  }
}
```

As shown above, you can configure the cache properties at a Global level. You can also provide these properties at the repository level. Options passed at the repository level will override the global options.

### Configuration Options

The following options can be passed:

<table>
<thead>
<tr>
  <th>Property</th>
  <th>Default Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>

<tr>
  <td>cacheProvider</td>
  <td>Redis</td>
  <td>

cacheProvider specifies the cache provider to be used. `CacheStrategyTypes.Redis` indicates that Redis is the chosen cache provider.

</td>
</tr>
<tr>
  <td>prefix</td>
  <td>sl</td>
  <td>Prefix is applied in the key of every cached entry when storing it inside caching provider. Each repository should have their own unique prefix.</td>
</tr>
<tr>
  <td>ttl</td>
  <td>60000</td>
  <td>TTL (time to live) is the maximum time in milliseconds for which data will remain cached in the caching provider. In other words this can be called the amount of time for which stale data is acceptable.</td>
</tr>

</tbody>
</table>

> NOTE : The caching is implemented as a key value pair. The key is in the form of `{{prefix}}_{{id}}_{{filter}}`. The format of the key plays a very important role in the cache hit ratio. For example: Consider a situation in which you are sending user id in filter with every request. This will generate a new key for every user. So even if same data is returned to all users, caching will not be beneficial until and unless the same user makes the same request multiple times.

### Apply Mixin to Repository

To use the caching functionality, you need to apply `CacheRespositoryMixin` provided in `CacheManager` class exported by this package to your repository.

Alongside You must inject the getter of the cache datasource with variable name `getCacheDataSource` in your repository's constructor, like below:

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

### Using It With Sequelize

`CacheRepositoryMixin` starting `v0.5.0` supports the [SequelizeCrudRepository](https://loopback.io/doc/en/lb4/apidocs.sequelize.sequelizecrudrepository.html).

Checkout [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) for more information on how to use sequelize in your project.

### Force Update

To forcefully update entries in cache, you can set `forceUpdate` to `true` in `options` parameter while invoking `find`, `findById` or `findOne`. Forcefully update will always return data from the original source and update the cache with the new data.

```ts
this.productRepository.findById(3, {}, {forceUpdate: true});
```

On updating forcefully the `ttl` option gets reset.

### Skip Cache

There are situations where disabling the cache becomes necessary, such as in a test environment or when bypassing it for any specific reason. In such cases, you can set the environment variable `SKIP_CACHE` to `true` to skip the cache functionality altogether.

### Clear Cache

To delete all cached entries for a repository, you can use the `clearCache` function on the repository, like below:

```ts
this.productRepository.clearCache();
```

It uses the `prefix` to find matching entries to delete.

## License

Sourceloop is [MIT licensed](./LICENSE).

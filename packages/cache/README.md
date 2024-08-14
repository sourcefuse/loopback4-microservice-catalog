# caching-guard

A Caching component that provides helpers for caching in Loopback4 based microservices.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Installation

Install CachingComponent using `npm`;

```sh
$ [npm install | yarn add] @sourceloop/cache
```

## Basic Usage

Configure and load CachingComponent in the application constructor
as shown below.

```ts
import {CachingComponent} from '@sourceloop/cache';
// ...
export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    this.bind(CacheComponentBindings.CacheConfig).to({
      ttl: 1000,
      strategy: RedisStoreStrategy,
      datasourceName: 'redisCacheStore',
    });
    this.component(CachingComponent);
    // ...
  }
  // ...
}
```

### In a repository

To add caching to a repository, just add it as a mixin to the base class -

```ts
export class TestWithMixinRepository extends CacheMixin(
  DefaultCrudRepository<Test, number, {}>,
) {
  cacheIdentifier = 'testRepo';
  constructor(@inject('datasources.memorydb') dataSource: juggler.DataSource) {
    super(Test, dataSource);
  }
}
```

### In a controller or service

To add caching to a service or controller, just implement the `ICachedService` interface, adding a binding for the `ICacheService` and the applying the relevant decorators to the methods you want cached -

```ts
export class TestController implements ICachedService {
  constructor(
    @repository(TestWithoutCachingRepository)
    public testModelRepository: TestWithoutCachingRepository,
    @inject(CacheComponentBindings.CacheService)
    public cache: ICacheService,
  ) {}
  cacheIdentifier = 'testRepo';

  @cacheInvalidator()
  @post('/tests')
  @response(200, {
    description: 'Test model instance',
    content: {'application/json': {schema: getModelSchemaRef(Test)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {
            title: 'NewTest',
            exclude: ['id'],
          }),
        },
      },
    })
    testModel: Omit<Test, 'id'>,
  ): Promise<Test> {
    return this.testModelRepository.create(testModel);
  }
  // ...
  @cachedItem()
  @get('/tests/count')
  @response(200, {
    description: 'Test model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Test) where?: Where<Test>): Promise<Count> {
    return this.testModelRepository.count(where);
  }
  /// ...
```

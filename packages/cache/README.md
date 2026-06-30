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

### Using with Sequelize Repositories

For repositories based on `SequelizeCrudRepository` from `@loopback/sequelize`, use the `SequelizeCacheMixin`:

```ts
import {SequelizeCacheMixin} from '@sourceloop/cache/sequelize';
import {SequelizeCrudRepository, SequelizeDataSource} from '@loopback/sequelize';

export class UserRepository extends SequelizeCacheMixin(
  SequelizeCrudRepository<User, number, {}>,
  {
    ttl: 1800,                    // Time to live in seconds (optional)
    invalidationTags: ['users'],   // Tags for cache invalidation on writes
    cachedItemTags: ['user-item'], // Tags for individual cache entries
    disableCachedFetch: false,     // Disable caching if needed (optional)
  },
) {
  cacheIdentifier = 'userRepo';   // Required: unique cache namespace

  constructor(
    @inject('datasources.postgres') dataSource: SequelizeDataSource,
  ) {
    super(User, dataSource);
  }
}
```

**Note:** Import from `@sourceloop/cache/sequelize` for Sequelize-specific caching.

**Difference from CacheMixin:**
- `CacheMixin` works with `DefaultCrudRepository` (Juggler-based)
- `SequelizeCacheMixin` works with `SequelizeCrudRepository` (Sequelize-based)
- Use the appropriate mixin based on your repository type

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | `number` | `86400` (1 day) | Cache expiration time in seconds |
| `invalidationTags` | `string[]` | `[]` | Tags to invalidate on create/update/delete |
| `cachedItemTags` | `string[]` | `[]` | Tags to apply to cached items |
| `disableCachedFetch` | `boolean` | `false` | Bypass cache for all reads |

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

## Advanced Usage

### Cache Strategies

The component supports two cache strategies:

#### 1. InMemoryStoreStrategy (Default)

Uses an in-memory Map. Suitable for development and single-instance deployments.

```ts
import {InMemoryStoreStrategy} from '@sourceloop/cache';

this.bind(CacheComponentBindings.CacheConfig).to({
  ttl: 3600,
  strategy: InMemoryStoreStrategy,
});
```

#### 2. RedisStoreStrategy

Uses Redis for distributed caching. Recommended for production.

```ts
import {RedisStoreStrategy} from '@sourceloop/cache';
import {juggler} from '@loopback/repository';

const redisDs = new juggler.DataSource({
  name: 'redisCacheStore',
  connector: 'kv-redis',
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

this.dataSource(redisDs);

this.bind(CacheComponentBindings.CacheConfig).to({
  ttl: 3600,
  strategy: RedisStoreStrategy,
  datasourceName: 'redisCacheStore',
});
```

### Cache Invalidation

Cache can be invalidated in two ways:

#### 1. Automatic Invalidation (Mixins)

Write operations (`create`, `update`, `delete`) automatically invalidate cache entries tagged with `invalidationTags`.

#### 2. Manual Invalidation (Decorators)

Use `@cacheInvalidator()` decorator on methods that modify data:

```ts
@cacheInvalidator(['users', 'notifications'])
async updateUserStatus(userId: number, status: string) {
  // This will invalidate all cache entries tagged with 'users' or 'notifications'
  return this.userRepository.updateById(userId, {status});
}
```

### Cache Customization

#### Per-Method Options

Override cache behavior for specific method calls:

```ts
// Force fresh data from database
const users = await this.userRepository.find(undefined, {
  forceUpdate: true,
});

// Add custom tags
const user = await this.userRepository.findById(1, undefined, {
  tags: ['admin-user', 'high-priority'],
});
```

#### Tenant-Aware Caching

Cache keys automatically include tenant ID when `AUTH_USER_KEY` is bound:

```ts
import {AUTH_USER_KEY} from '@sourceloop/cache';

this.bind(AUTH_USER_KEY).to({
  tenantId: 'tenant-123',
  username: 'admin',
});
```

## API Reference

### Decorators

#### `@cachedItem()`
Cache the return value of a method.

```ts
@cachedItem()
async getUser(id: number): Promise<User> {
  return this.userRepository.findById(id);
}
```

#### `@cacheInvalidator(tags: string[])`
Invalidate cache entries matching the given tags.

```ts
@cacheInvalidator(['users'])
async updateUser(id: number, data: Partial<User>): Promise<User> {
  return this.userRepository.updateById(id, data);
}
```

### Interfaces

#### `ICacheMixinOptions`

Configuration options for cache mixins.

```ts
interface ICacheMixinOptions {
  ttl?: number;                    // Time to live in seconds
  invalidationTags?: string[];     // Tags for write operations
  cachedItemTags?: string[];       // Tags for read operations
  disableCachedFetch?: boolean;    // Disable caching
}
```

#### `ICachedMethodOptions`

Options for individual method calls.

```ts
interface ICachedMethodOptions {
  forceUpdate?: boolean;   // Force fresh data from source
  tags?: string[];         // Additional cache tags
}
```

## Migration from CacheMixin to SequelizeCacheMixin

If you're migrating from Juggler to Sequelize repositories:

1. **Update import:**
   ```ts
   // Before
   import {CacheMixin} from '@sourceloop/cache';

   // After
   import {SequelizeCacheMixin} from '@sourceloop/cache/sequelize';
   ```

2. **Update repository base:**
   ```ts
   // Before
   export class UserRepo extends CacheMixin(
     DefaultCrudRepository<User, number, {}>,
     options,
   ) { ... }

   // After
   export class UserRepo extends SequelizeCacheMixin(
     SequelizeCrudRepository<User, number, {}>,
     options,
   ) { ... }
   ```

3. **Update constructor:**
   ```ts
   // Before
   constructor(@inject('datasources.memorydb') dataSource: juggler.DataSource) { ... }

   // After
   constructor(@inject('datasources.postgres') dataSource: SequelizeDataSource) { ... }
   ```

## License

MIT

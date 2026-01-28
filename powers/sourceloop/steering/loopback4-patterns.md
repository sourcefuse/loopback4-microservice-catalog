# LoopBack 4 Patterns for ARC Services

## Component Architecture

Every ARC service is a LoopBack 4 Component. Components bind controllers, models, repositories, providers, and services into an application.

```typescript
// Mount a service component
this.component(AuthenticationServiceComponent);

// Bind configuration
this.bind(AuthServiceBindings.Config).to({
  useCustomSequence: true,
});
```

## Models

Models use decorators from `@loopback/repository`:

```typescript
import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'my_entities',
  settings: {strict: false},
})
export class MyEntity extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;
}
```

### Base Entity Classes

- `BaseEntity` - Basic entity with `id`
- `UserModifiableEntity` - Adds `createdBy`, `modifiedBy`, `createdOn`, `modifiedOn`
- `SoftDeleteEntity` - Adds soft-delete support via `deleted` flag

Always extend `UserModifiableEntity` for audit-tracked entities.

## Repositories

Repositories handle data access. Use `DefaultUserModifyCrudRepository` from `@sourceloop/core`:

```typescript
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {inject} from '@loopback/core';

export class MyEntityRepository extends DefaultUserModifyCrudRepository<
  MyEntity,
  typeof MyEntity.prototype.id
> {
  constructor(
    @inject('datasources.mydb') dataSource: juggler.DataSource,
  ) {
    super(MyEntity, dataSource);
  }
}
```

For Sequelize ORM, use:

```typescript
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
```

## Controllers

Controllers define REST API endpoints:

```typescript
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {api, get, param} from '@loopback/rest';

export class MyController {
  constructor(
    @repository(MyEntityRepository)
    public myEntityRepository: MyEntityRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['ViewMyEntity']})
  @get('/my-entities')
  async find(
    @param.filter(MyEntity) filter?: Filter<MyEntity>,
  ): Promise<MyEntity[]> {
    return this.myEntityRepository.find(filter);
  }
}
```

## Providers

Providers supply dynamic values via dependency injection:

```typescript
import {Provider} from '@loopback/core';

export class MyProvider implements Provider<MyInterface> {
  value(): MyInterface {
    return {
      // implementation
    };
  }
}
```

## Datasources

Configure datasources via environment variables:

```typescript
const config = {
  name: 'mydb',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
```

## Sequences

ARC provides pre-built sequences in `@sourceloop/core`:

- `ServiceSequence` - Authentication + authorization
- `SecureSequence` - Authentication + authorization + helmet + rate limiting
- `CasbinSecureSequence` - RBAC via Casbin policies

```typescript
this.sequence(SecureSequence);
```

## Multi-Tenancy

Use the Dynamic Datasource component for tenant-aware data access:

```typescript
import {DynamicDatasourceComponent} from '@sourceloop/core/dynamic-datasource';

this.component(DynamicDatasourceComponent);
```

Tenant context is extracted from JWT tokens and used to switch datasources at runtime.

## Binding Keys

Each service exports binding keys for configuration:

```typescript
import {AuthServiceBindings} from '@sourceloop/authentication-service';

this.bind(AuthServiceBindings.Config).to({
  useCustomSequence: true,
});
```

Always configure services through their binding keys rather than modifying source code.

## Database Migrations

Services use `db-migrate` for schema management:

```bash
# Run migrations
npx db-migrate up --config database.json --migrations-dir migrations

# Create a new migration
npx db-migrate create my-migration --config database.json --migrations-dir migrations
```

Migration files go in the `migrations/` directory of each service.

## Testing

Tests use Mocha and live in `src/__tests__/`:

```typescript
import {expect} from '@loopback/testlab';

describe('MyEntity', () => {
  it('should create an entity', async () => {
    const entity = await repository.create({name: 'test'});
    expect(entity.id).to.not.be.undefined();
  });
});
```

Run tests with:

```bash
npm test
```

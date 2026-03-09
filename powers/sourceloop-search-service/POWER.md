---
name: 'sourceloop-search-service'
displayName: 'SourceLoop Search Service'
description: 'Add full-text search and advanced filtering across multiple models with PostgreSQL-backed search indexing'
keywords:
  [
    'search',
    'full-text',
    'filter',
    'query',
    'indexing',
    'sourceloop',
    'elasticsearch',
    'postgresql-search',
  ]
author: 'SourceFuse'
---

# SourceLoop Search Service

## Overview

A LoopBack 4 microservice for full-text search and advanced filtering across multiple data models. Provides flexible query capabilities with PostgreSQL full-text search support.

**Key capabilities:**

- **Full-text Search**: Search across multiple entity types
- **Advanced Filtering**: Complex filter expressions with AND/OR/NOT
- **Multi-model Search**: Search across different models simultaneously
- **Search Indexing**: Index configuration for optimized queries
- **Flexible Queries**: Support for fuzzy matching and ranking

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=search-service` to scaffold a new search service instance.

## Installation

```typescript
import {SearchServiceComponent} from '@sourceloop/search-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateSearchEnv();

    try {
      this.component(SearchServiceComponent);
      console.log('✅ Search service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize search service:', error.message);
      throw error;
    }
  }

  private validateSearchEnv() {
    const required = ['DB_HOST', 'DB_PORT', 'DB_DATABASE'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }
}
```

## Common Workflows

### Workflow 1: Setup Search Service

```bash
npx @sourceloop/cli microservice my-search \
  --baseOnService \
  --baseService=search-service \
  --datasourceName=searchdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-search

# Test database connection
npm run db:ping

# Run migrations and verify
npm run db:migrate
npm run db:migrate:status

# Verify service starts
npm run build
npm start &
curl http://localhost:3000/ping
```

**Critical validation checklist:**

- ✅ Database connectivity verified
- ✅ All migrations applied successfully
- ✅ Service starts without errors
- ✅ Health endpoint responds

## Best Practices

### Do:

- Create proper PostgreSQL full-text search indexes
- Use pagination for search results
- Define search models with appropriate fields indexed
- Implement relevance ranking for search results

### Don't:

- Search without indexes on large datasets
- Return unlimited results - always paginate
- Index every field - select the most relevant ones
- Ignore search performance on large datasets

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {SearchController} from '../controllers';
import {SearchRepository} from '../repositories';

describe('SearchController', () => {
  let controller: SearchController;
  let searchRepo: sinon.SinonStubbedInstance<SearchRepository>;

  beforeEach(() => {
    searchRepo = createStubInstance(SearchRepository);
    controller = new SearchController(searchRepo);
  });

  it('should search with query text', async () => {
    const results = [
      {id: '1', title: 'Test Document', rank: 0.95},
      {id: '2', title: 'Another Test', rank: 0.75},
    ];
    searchRepo.search.resolves(results);
    
    const response = await controller.search({q: 'test'});
    expect(response).to.have.length(2);
    expect(response[0].rank).to.be.greaterThan(response[1].rank);
  });

  it('should apply filters to search', async () => {
    await controller.search({q: 'test', filter: {category: 'articles'}});
    
    sinon.assert.calledWith(searchRepo.search, sinon.match({
      where: {category: 'articles'},
    }));
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {SearchApplication} from '../application';

describe('Search API', () => {
  let app: SearchApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    // Seed test data
    await seedSearchData();
  });

  it('GET /search performs full-text search', async () => {
    const res = await client
      .get('/search')
      .query({q: 'javascript tutorial'})
      .expect(200);
    
    expect(res.body.results).to.be.Array();
    expect(res.body.total).to.be.a.Number();
  });

  it('GET /search with pagination', async () => {
    const res = await client
      .get('/search')
      .query({q: 'test', limit: 10, offset: 0})
      .expect(200);
    
    expect(res.body.results.length).to.be.lessThanOrEqual(10);
  });
});
```

### Testing Best Practices

- Test search with various query patterns (single word, phrases, Boolean operators)
- Verify pagination limits and offsets
- Test relevance ranking algorithms
- Validate search index creation and updates
- Test search performance with large datasets

## Database

Requires PostgreSQL (leverages PostgreSQL full-text search). Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `loopback4-soft-delete`

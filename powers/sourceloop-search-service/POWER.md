---
name: "sourceloop-search-service"
displayName: "SourceLoop Search Service"
description: "Add full-text search and advanced filtering across multiple models with PostgreSQL-backed search indexing"
keywords: ["search", "full-text", "filter", "query", "indexing", "sourceloop", "elasticsearch", "postgresql-search"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(SearchServiceComponent);
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
```

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

## Database

Requires PostgreSQL (leverages PostgreSQL full-text search). Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `loopback4-soft-delete`

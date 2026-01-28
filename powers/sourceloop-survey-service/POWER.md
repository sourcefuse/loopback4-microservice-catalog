---
name: "sourceloop-survey-service"
displayName: "SourceLoop Survey Service"
description: "Create and manage surveys, questionnaires, and feedback forms with question management, response collection, and analytics"
keywords: ["survey", "questionnaire", "feedback", "form", "poll", "response", "sourceloop", "assessment"]
author: "SourceFuse"
---

# SourceLoop Survey Service

## Overview

A LoopBack 4 microservice for survey and questionnaire management. Supports survey creation, question management, response collection, and survey analytics.

**Key capabilities:**

- **Survey Creation**: Design surveys with multiple question types
- **Question Management**: CRUD for survey questions with ordering
- **Response Collection**: Collect and store user responses
- **Analytics**: Aggregate and analyze survey results
- **HTML Parsing**: JSDOM-based rich content support

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=survey-service` to scaffold a new survey service instance.

## Installation

```typescript
import {SurveyServiceComponent} from '@sourceloop/survey-service';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(SurveyServiceComponent);
  }
}
```

## Key Models

- **Survey** - Survey entity with title, description, status
- **Question** - Question types (multiple choice, text, rating, etc.)
- **Response** - User responses linked to surveys and questions

## Common Workflows

### Workflow 1: Setup Survey Service

```bash
npx @sourceloop/cli microservice my-surveys \
  --baseOnService \
  --baseService=survey-service \
  --datasourceName=surveydb \
  --datasourceType=postgresql \
  --includeMigrations
```

## Best Practices

### Do:
- Use question ordering for consistent survey presentation
- Validate response data against question types
- Implement survey status transitions (draft, active, closed)
- Use pagination for response retrieval on large surveys

### Don't:
- Allow responses to closed surveys
- Skip input validation on response submission
- Load all responses without pagination
- Modify questions after responses have been collected

## Database

Requires PostgreSQL (also supports MySQL and SQLite). Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `jsdom`
- `on-finished`
- `loopback4-soft-delete`

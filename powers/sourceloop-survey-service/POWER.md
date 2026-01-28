---
name: 'sourceloop-survey-service'
displayName: 'SourceLoop Survey Service'
description: 'Create and manage surveys, questionnaires, and feedback forms with question management, response collection, and analytics'
keywords:
  [
    'survey',
    'questionnaire',
    'feedback',
    'form',
    'poll',
    'response',
    'sourceloop',
    'assessment',
  ]
author: 'SourceFuse'
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
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate required environment variables
    this.validateSurveyEnv();

    try {
      this.component(SurveyServiceComponent);
      console.log('✅ Survey service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize survey service:', error.message);
      throw error;
    }
  }

  private validateSurveyEnv() {
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

# After scaffolding, add these verification steps:
cd my-surveys

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

- Use question ordering for consistent survey presentation
- Validate response data against question types
- Implement survey status transitions (draft, active, closed)
- Use pagination for response retrieval on large surveys

### Don't:

- Allow responses to closed surveys
- Skip input validation on response submission
- Load all responses without pagination
- Modify questions after responses have been collected

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {SurveyController} from '../controllers';
import {SurveyRepository, ResponseRepository} from '../repositories';

describe('SurveyController', () => {
  let controller: SurveyController;
  let surveyRepo: sinon.SinonStubbedInstance<SurveyRepository>;
  let responseRepo: sinon.SinonStubbedInstance<ResponseRepository>;

  beforeEach(() => {
    surveyRepo = createStubInstance(SurveyRepository);
    responseRepo = createStubInstance(ResponseRepository);
    controller = new SurveyController(surveyRepo, responseRepo);
  });

  it('should create survey with questions', async () => {
    const survey = {
      name: 'Customer Satisfaction',
      status: 'draft',
      questions: [
        {text: 'How satisfied are you?', type: 'rating', required: true},
      ],
    };
    
    await controller.create(survey);
    sinon.assert.calledOnce(surveyRepo.create);
  });

  it('should reject response to closed survey', async () => {
    const closedSurvey = {id: 'survey-1', status: 'closed'};
    surveyRepo.findById.resolves(closedSurvey);
    
    await expect(controller.submitResponse('survey-1', {answers: []}))
      .to.be.rejectedWith('Survey is closed');
  });

  it('should validate required questions', async () => {
    const survey = {
      id: 'survey-1',
      status: 'active',
      questions: [{id: 'q1', required: true}],
    };
    surveyRepo.findById.resolves(survey);
    
    const incompleteResponse = {answers: []}; // Missing required answer
    await expect(controller.submitResponse('survey-1', incompleteResponse))
      .to.be.rejectedWith('Missing required answers');
  });
});
```

### Integration Tests

```typescript
import {Client, expect} from '@loopback/testlab';
import {SurveyApplication} from '../application';

describe('Survey API', () => {
  let app: SurveyApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  it('POST /surveys creates new survey', async () => {
    const res = await client.post('/surveys').send({
      name: 'Product Feedback',
      description: 'Help us improve',
      status: 'draft',
    }).expect(200);
    
    expect(res.body).to.have.property('id');
    expect(res.body.status).to.equal('draft');
  });

  it('POST /surveys/:id/responses submits response', async () => {
    const res = await client
      .post('/surveys/survey-123/responses')
      .send({
        answers: [
          {questionId: 'q1', value: '5'},
          {questionId: 'q2', value: 'Great product!'},
        ],
      })
      .expect(200);
    
    expect(res.body).to.have.property('id');
  });

  it('GET /surveys/:id/results returns aggregated results', async () => {
    const res = await client.get('/surveys/survey-123/results').expect(200);
    
    expect(res.body).to.have.property('totalResponses');
    expect(res.body).to.have.property('questionResults');
  });
});
```

### Testing Best Practices

- Test question type validation (text, rating, multiple-choice)
- Verify survey status transitions (draft → active → closed)
- Test conditional logic and question branching
- Validate response data against question types
- Test pagination for large response datasets

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

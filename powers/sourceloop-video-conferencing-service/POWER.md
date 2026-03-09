---
name: 'sourceloop-video-conferencing-service'
displayName: 'SourceLoop Video Conferencing Service'
description: 'Integrate video conferencing with OpenTok (Vonage) and Twilio Video - manage meetings, sessions, participants, and recordings'
keywords:
  [
    'video',
    'conferencing',
    'meeting',
    'vonage',
    'opentok',
    'twilio-video',
    'webrtc',
    'sourceloop',
  ]
author: 'SourceFuse'
---

# SourceLoop Video Conferencing Service

## Overview

A LoopBack 4 microservice for video conferencing integration. Supports OpenTok (Vonage) and Twilio Video platforms with meeting management, session handling, participant tracking, and recording capabilities.

**Key capabilities:**

- **Multi-platform**: OpenTok (Vonage) and Twilio Video integration
- **Meeting Management**: Create, schedule, and manage video meetings
- **Session Handling**: Token generation for participant connections
- **Participant Management**: Track who joins and leaves
- **Recording**: Start, stop, and manage session recordings

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=video-conferencing-service` to scaffold a new video conferencing service instance.

## Installation

```typescript
import {VideoConfServiceComponent} from '@sourceloop/video-conferencing-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate video provider configuration
    this.validateVideoEnv();

    try {
      this.component(VideoConferencingServiceComponent);
      console.log('✅ Video conferencing service loaded successfully');
    } catch (error) {
      console.error(
        '❌ Failed to initialize video conferencing service:',
        error.message,
      );
      throw error;
    }
  }

  private validateVideoEnv() {
    const required = ['DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate video provider (Vonage or Twilio)
    const hasVonage =
      process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET;
    const hasTwilio =
      process.env.TWILIO_VIDEO_API_KEY && process.env.TWILIO_VIDEO_API_SECRET;

    if (!hasVonage && !hasTwilio) {
      throw new Error('Video provider required (Vonage or Twilio)');
    }

    if (hasVonage && hasTwilio) {
      console.warn(
        '⚠️  Multiple video providers configured. Only one should be active.',
      );
    }
  }
}
```

## Key Models

- **VideoConference** - Meeting/conference entity
- **Session** - Video session with provider-specific IDs
- **Participant** - Meeting participant records
- **Recording** - Recording metadata and storage

## Environment Variables

| Variable                  | Description               |
| ------------------------- | ------------------------- |
| `VONAGE_API_KEY`          | OpenTok/Vonage API key    |
| `VONAGE_API_SECRET`       | OpenTok/Vonage API secret |
| `TWILIO_ACCOUNT_SID`      | Twilio account SID        |
| `TWILIO_AUTH_TOKEN`       | Twilio auth token         |
| `TWILIO_VIDEO_API_KEY`    | Twilio Video API key      |
| `TWILIO_VIDEO_API_SECRET` | Twilio Video API secret   |

## Common Workflows

### Workflow 1: Setup Video Conferencing Service

```bash
npx @sourceloop/cli microservice my-video \
  --baseOnService \
  --baseService=video-conferencing-service \
  --datasourceName=videodb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-video

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

- Choose one video provider (Vonage or Twilio) per deployment
- Use short-lived tokens for session access
- Implement webhook handlers for session events
- Store recordings in cloud storage (S3) rather than locally

### Don't:

- Mix video providers in the same deployment
- Generate long-lived session tokens
- Skip participant authentication before generating video tokens
- Store API secrets in client-side code

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {SessionController} from '../controllers';
import {SessionRepository} from '../repositories';
import {VonageProvider} from '../providers';

describe('SessionController', () => {
  let controller: SessionController;
  let sessionRepo: sinon.SinonStubbedInstance<SessionRepository>;
  let vonageProvider: sinon.SinonStubbedInstance<VonageProvider>;

  beforeEach(() => {
    sessionRepo = createStubInstance(SessionRepository);
    vonageProvider = {
      createSession: sinon.stub().resolves({sessionId: 'session-123'}),
      generateToken: sinon.stub().resolves('token-abc'),
    };
    controller = new SessionController(sessionRepo, vonageProvider);
  });

  it('should create video session', async () => {
    const session = await controller.createSession({
      meetingName: 'Team Standup',
      startTime: new Date(),
    });
    
    sinon.assert.calledOnce(vonageProvider.createSession);
    expect(session).to.have.property('sessionId');
  });

  it('should generate participant token', async () => {
    const token = await controller.generateToken('session-123', {
      userId: 'user-1',
      role: 'moderator',
    });
    
    sinon.assert.calledWith(vonageProvider.generateToken, 'session-123', sinon.match({
      role: 'moderator',
    }));
    expect(token).to.be.String();
  });
});
```

### Integration Tests with Mock Providers

```typescript
import {Client, expect} from '@loopback/testlab';
import {VideoConferencingApplication} from '../application';

class MockVonageProvider {
  sessions = new Map();
  
  async createSession(options: any) {
    const sessionId = `mock-session-${Date.now()}`;
    this.sessions.set(sessionId, options);
    return {sessionId, apiKey: 'mock-api-key'};
  }
  
  async generateToken(sessionId: string, options: any) {
    return `mock-token-${sessionId}-${options.userId}`;
  }
  
  async startArchive(sessionId: string) {
    return {archiveId: `archive-${sessionId}`, status: 'started'};
  }
}

describe('Video Conferencing API', () => {
  let app: VideoConferencingApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    app.bind('services.VonageProvider').toClass(MockVonageProvider);
  });

  it('POST /sessions creates video session', async () => {
    const res = await client.post('/sessions').send({
      meetingName: 'Client Demo',
      scheduledTime: '2024-03-01T10:00:00Z',
    }).expect(200);
    
    expect(res.body).to.have.property('sessionId');
    expect(res.body).to.have.property('apiKey');
  });

  it('POST /sessions/:id/token generates participant token', async () => {
    const res = await client
      .post('/sessions/session-123/token')
      .send({userId: 'user-1', role: 'publisher'})
      .expect(200);
    
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('expiresAt');
  });
});
```

### Testing Best Practices

- Mock Vonage/Twilio providers to avoid API costs
- Test token expiration and renewal
- Verify participant roles (publisher, subscriber, moderator)
- Test recording start/stop flows
- Validate webhook handling for session events

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `opentok`
- `twilio`
- `axios`, `moment`

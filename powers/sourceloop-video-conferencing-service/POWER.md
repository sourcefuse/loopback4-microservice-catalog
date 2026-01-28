---
name: "sourceloop-video-conferencing-service"
displayName: "SourceLoop Video Conferencing Service"
description: "Integrate video conferencing with OpenTok (Vonage) and Twilio Video - manage meetings, sessions, participants, and recordings"
keywords: ["video", "conferencing", "meeting", "vonage", "opentok", "twilio-video", "webrtc", "sourceloop"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(VideoConfServiceComponent);
  }
}
```

## Key Models

- **VideoConference** - Meeting/conference entity
- **Session** - Video session with provider-specific IDs
- **Participant** - Meeting participant records
- **Recording** - Recording metadata and storage

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VONAGE_API_KEY` | OpenTok/Vonage API key |
| `VONAGE_API_SECRET` | OpenTok/Vonage API secret |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_VIDEO_API_KEY` | Twilio Video API key |
| `TWILIO_VIDEO_API_SECRET` | Twilio Video API secret |

## Common Workflows

### Workflow 1: Setup Video Conferencing Service

```bash
npx @sourceloop/cli microservice my-video \
  --baseOnService \
  --baseService=video-conferencing-service \
  --datasourceName=videodb \
  --datasourceType=postgresql \
  --includeMigrations
```

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

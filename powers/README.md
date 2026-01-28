# ARC by SourceLoop - Kiro Powers

This directory contains [Kiro Powers](https://kiro.dev/powers/) for the ARC microservice catalog. Each power provides specialized context and tools to Kiro agents for working with SourceLoop services.

## Available Powers

| Power | Description |
|-------|-------------|
| [`sourceloop`](./sourceloop/) | Core ARC framework, CLI scaffolding, and LoopBack 4 patterns |
| [`sourceloop-authentication-service`](./sourceloop-authentication-service/) | Multi-tenant authentication with OAuth, MFA, SAML, JWT |
| [`sourceloop-oidc-service`](./sourceloop-oidc-service/) | OpenID Connect identity server |
| [`sourceloop-audit-service`](./sourceloop-audit-service/) | Audit logging with S3 archival |
| [`sourceloop-notification-service`](./sourceloop-notification-service/) | Multi-channel notifications (email, SMS, push, WebSocket) |
| [`sourceloop-chat-service`](./sourceloop-chat-service/) | Real-time chat messaging with groups |
| [`sourceloop-in-mail-service`](./sourceloop-in-mail-service/) | Incoming email management |
| [`sourceloop-video-conferencing-service`](./sourceloop-video-conferencing-service/) | Video conferencing with Vonage and Twilio |
| [`sourceloop-payment-service`](./sourceloop-payment-service/) | Payments via PayPal, Stripe, Razorpay |
| [`sourceloop-bpmn-service`](./sourceloop-bpmn-service/) | BPMN workflows with Camunda |
| [`sourceloop-task-service`](./sourceloop-task-service/) | Event-driven task management (Kafka/SQS/HTTP) |
| [`sourceloop-scheduler-service`](./sourceloop-scheduler-service/) | Job scheduling and cron tasks |
| [`sourceloop-search-service`](./sourceloop-search-service/) | Full-text search and filtering |
| [`sourceloop-survey-service`](./sourceloop-survey-service/) | Surveys, questionnaires, and feedback |
| [`sourceloop-feature-toggle-service`](./sourceloop-feature-toggle-service/) | Feature flags and toggles |
| [`sourceloop-user-tenant-service`](./sourceloop-user-tenant-service/) | User and tenant management with RBAC |
| [`sourceloop-reporting-service`](./sourceloop-reporting-service/) | Report generation with S3 export |

## Installing a Power

In Kiro IDE:

1. Open the Powers panel
2. Click **Add power from GitHub**
3. Enter the repository URL with the subdirectory path (e.g., `https://github.com/sourcefuse/loopback4-microservice-catalog/powers/sourceloop-authentication-service`)

For local development:

1. Open the Powers panel
2. Click **Add power from Local Path**
3. Select the power directory

## Power Structure

Each power contains:

```
power-name/
├── POWER.md    # Metadata, documentation, and agent guidance
└── mcp.json    # MCP server configuration (points to @sourceloop/cli)
```

The core `sourceloop` power also includes steering files:

```
sourceloop/
├── POWER.md
├── mcp.json
└── steering/
    ├── loopback4-patterns.md   # LoopBack 4 conventions and patterns
    └── cli-usage.md            # ARC CLI command reference
```

## MCP Server

All powers reference the `@sourceloop/cli` MCP server, which provides tools for:

- Scaffolding monorepos and microservices
- Adding AWS CDK deployment support
- Generating Angular and React frontends
- Updating project dependencies

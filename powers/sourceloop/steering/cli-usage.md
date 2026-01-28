# ARC CLI Usage Guide

## Installation

```bash
npm install -g @sourceloop/cli
```

Or use via npx:

```bash
npx @sourceloop/cli <command>
```

## Commands

### scaffold

Create a new ARC monorepo with npm workspaces structure:

```bash
arc scaffold my-project
```

Creates:
```
my-project/
├── services/       # Microservices
├── facades/        # API facades
├── packages/       # Shared packages
├── package.json    # Workspace root
└── ...
```

Options:
- `--issuePrefix` - Prefix for issue tracking (e.g., "JIRA-")
- `--integrateWithBackstage` - Add Backstage catalog integration
- `--owner` - Project owner identifier
- `--description` - Project description

### microservice

Add a microservice to an existing ARC monorepo:

```bash
arc microservice my-service
```

Options:
- `--baseOnService` - Base on an existing SourceLoop service
- `--baseService` - Which service to base on (authentication-service, notification-service, etc.)
- `--facade` - Create as a facade instead of service
- `--datasourceName` - Name for the datasource
- `--datasourceType` - Type: postgresql, mysql, etc.
- `--sequelize` - Use Sequelize ORM instead of default LB4 repositories
- `--includeMigrations` - Include database migration setup
- `--customMigrations` - Use custom migration templates

Available base services:
- `authentication-service`
- `audit-service`
- `bpmn-service`
- `chat-service`
- `feature-toggle-service`
- `in-mail-service`
- `notification-service`
- `oidc-service`
- `payment-service`
- `reporting-service`
- `scheduler-service`
- `search-service`
- `survey-service`
- `task-service`
- `user-tenant-service`
- `video-conferencing-service`

### extension

Generate a shared package in the packages folder:

```bash
arc extension my-package
```

### cdk

Add AWS CDK or CDKTF infrastructure support:

```bash
arc cdk --iac=cdk --dir=services/my-service
```

Options:
- `--iac` - Infrastructure tool: `cdk` or `cdktf`
- `--dir` - Path to the microservice directory
- `--overwriteDockerfile` - Replace existing Dockerfile

### update

Update all project dependencies:

```bash
arc update
```

### angular

Scaffold an Angular project from ARC boilerplate:

```bash
arc angular:scaffold my-app
```

Options:
- `--templateRepo` - Custom template repository URL
- `--templateVersion` - Template version to use
- `--installDeps` - Auto-install dependencies

### react

Scaffold a React (Vite + TypeScript) project:

```bash
arc react:scaffold my-app
```

Options:
- `--templateRepo` - Custom template repository URL
- `--templateVersion` - Template version to use
- `--installDeps` - Auto-install dependencies

## MCP Integration

The CLI includes a built-in MCP server for AI assistant integration:

```bash
arc mcp
```

Configure in `.claude/mcp.json`:

```json
{
  "sourceloop-cli": {
    "command": "npx",
    "args": ["-y", "@sourceloop/cli", "mcp"],
    "timeout": 300
  }
}
```

This enables AI assistants to scaffold projects, add microservices, and manage dependencies programmatically.

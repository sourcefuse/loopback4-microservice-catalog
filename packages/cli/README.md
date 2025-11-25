# sourceloop-cli

A unified CLI for scaffolding and managing SourceLoop projects across the full stack - backend (LoopBack4 microservices), Angular, and React applications. The CLI provides AI-powered development assistance through the Model Context Protocol (MCP).

## Features

- **🏗️ Backend Development**: Scaffold ARC monorepos, microservices, and extensions
- **⚛️ React Support**: Scaffold React projects from ARC boilerplate
- **🅰️ Angular Support**: Scaffold Angular projects from ARC boilerplate
- **🤖 AI Integration**: Built-in MCP server for AI-assisted development (Claude Code, etc.)
- **📦 Template Management**: Smart template fetching from GitHub with local development support

## Installation

```shell
npm install -g @sourceloop/cli
```

Once installed, you can use either `sl` or `arc` as shorthand to run any command.

## Quick Start

```bash
# Scaffold a backend ARC monorepo
sl scaffold my-backend

# Scaffold an Angular project
sl angular:scaffold my-angular-app

# Scaffold a React project
sl react:scaffold my-react-app

# For component generation, use the framework-specific CLI:
# - Angular: Use Angular CLI (ng generate)
# - React: Use your preferred tool (create-react-app, Vite, etc.)
```

## MCP Integration

All scaffolded projects automatically include MCP configuration in `mcp.json`. This enables AI assistants like Roo Code to interact with your project intelligently.

To use the CLI as an MCP server, add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "sourceloop": {
      "command": "sl",
      "args": ["mcp"],
      "alwaysAllow": ["Scaffold", "Microservice", "Extension", "help"],
      "timeout": 300,
      "disabled": false
    }
  }
}
```

## Usage

<!-- usage -->

```sh-session
$ npm install -g @sourceloop/cli
$ sl COMMAND
running command...
$ sl (-v|--version|version)
@sourceloop/cli/12.0.0 darwin-arm64 node-v22.16.0
$ sl --help [COMMAND]
USAGE
  $ sl COMMAND
...
```

<!-- usagestop -->

## Commands

<!-- commands -->

- [`sl autocomplete [SHELL]`](#sl-autocomplete-shell)
- [`sl cdk`](#sl-cdk)
- [`sl extension [NAME]`](#sl-extension-name)
- [`sl help [COMMAND]`](#sl-help-command)
- [`sl mcp`](#sl-mcp)
- [`sl microservice [NAME]`](#sl-microservice-name)
- [`sl update`](#sl-update)
- [`sl scaffold [NAME]`](#sl-scaffold-name)
- [`sl angular:scaffold [NAME]`](#sl-angularscaffold-name)
- [`sl react:scaffold [NAME]`](#sl-reactscaffold-name)

## `sl angular:scaffold [NAME]`

Scaffold a new Angular project from ARC boilerplate

```
USAGE
  $ sl angular:scaffold [NAME]

ARGUMENTS
  NAME  Project name

OPTIONS
  --help                       Show manual pages
  --installDeps                Install dependencies after scaffolding
  --templateRepo=templateRepo  [default: sourcefuse/angular-boilerplate] Template repository (owner/repo or local path)
```

_See code: [src/commands/angular/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/angular/scaffold.ts)_

## `sl autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ sl autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ sl autocomplete
  $ sl autocomplete bash
  $ sl autocomplete zsh
  $ sl autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.10/src/commands/autocomplete/index.ts)_

## `sl cdk`

add arc-cdk

```
USAGE
  $ sl cdk

OPTIONS
  -a, --applicationClassName=applicationClassName  Class name of the service you want to deploy
  -d, --dir=dir                                    Name of the dir to store arc-cdk files
  -i, --iac=(lambda)                               iac for the service

  -o, --overwriteDockerfile                        Overwrite the existing Dockerfile for Lambda deployment (if it
                                                   exists)?

  -p, --packageJsonName=packageJsonName            Package name for arc-cdk

  -r, --relativePathToApp=relativePathToApp        Relative path to the application ts file

  --help                                           show manual pages
```

_See code: [src/commands/cdk.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/cdk.ts)_

## `sl extension [NAME]`

This generates a local package in the packages folder of a ARC generated monorepo. This package can then be installed and used inside other modules in the monorepo.

```
USAGE
  $ sl extension [NAME]

ARGUMENTS
  NAME  Name of the extension

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/extension.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/extension.ts)_

## `sl help [COMMAND]`

display help for sl

```
USAGE
  $ sl help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `sl mcp`

Command that runs an MCP server for the sourceloop CLI, this is not supposed to be run directly, but rather used by the MCP client to interact with the CLI commands.

```
USAGE
  $ sl mcp

OPTIONS
  --help  show manual pages

DESCRIPTION
  Command that runs an MCP server for the sourceloop CLI, this is not supposed to be run directly, but rather used by
  the MCP client to interact with the CLI commands.
    You can use it using the following MCP server configuration:
      "sourceloop": {
        "command": "npx",
        "args": ["@sourceloop/cli", "mcp"],
        "timeout": 300
      }
```

_See code: [src/commands/mcp.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/mcp.ts)_

## `sl microservice [NAME]`

Add a microservice in the services or facade folder of a ARC generated monorepo. This can also optionally add migrations for the same microservice.

```
USAGE
  $ sl microservice [NAME]

ARGUMENTS
  NAME  Name of the microservice

OPTIONS
  -p, --uniquePrefix=uniquePrefix
      Unique prefix to be used for docker images

  -s, --baseService=(authentication-service|audit-service|chat-service|notification-service|bpmn-service|feature-toggle-
  service|in-mail-service|payment-service|scheduler-service|search-service|survey-service|task-service|video-conferencin
  g-service|user-tenant-service|reporting-service)
      Base ARC microservice

  --[no-]baseOnService
      Base on ARC microservice or not

  --customMigrations
      Setup custom migration for this microservice

  --datasourceName=datasourceName
      Name of the datasource to generate

  --datasourceType=(postgres|mysql)
      Type of the datasource

  --[no-]facade
      Create as facade inside the facades folder

  --help
      show manual pages

  --includeMigrations
      Include base microservice migrations

  --sequelize
      Include sequelize as ORM in service
```

_See code: [src/commands/microservice.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/microservice.ts)_

## `sl react:scaffold [NAME]`

Scaffold a new React project from ARC boilerplate

```
USAGE
  $ sl react:scaffold [NAME]

ARGUMENTS
  NAME  Project name

OPTIONS
  --help                             Show manual pages
  --installDeps                      Install dependencies after scaffolding
  --templateRepo=templateRepo        [default: sourcefuse/react-boilerplate-ts-ui] Template repository (org/repo)
  --templateVersion=templateVersion  Template branch or version
```

_See code: [src/commands/react/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/react/scaffold.ts)_

## `sl scaffold [NAME]`

Setup a ARC based monorepo using npm workspaces with an empty services, facades and packages folder

```
USAGE
  $ sl scaffold [NAME]

ARGUMENTS
  NAME  name of the project

OPTIONS
  --cwd=cwd                  Directory where project will be scaffolded, instead of the project name
  --description=description  description of the repo
  --helmPath=helmPath        Enter the path for Helm chart:
  --help                     show manual pages
  --integrateWithBackstage   Do you want to include backstage integration files?
  --issuePrefix=issuePrefix  Prefix to be used for issues(e.g. GH-)
  --jenkinsfile              Do you want to create a Jenkinsfile for Helm-based deployment on Kubernetes?
  --owner=owner              owner of the repo
```

_See code: [src/commands/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/scaffold.ts)_

## `sl update`

update the dependencies of a loopback project

```
USAGE
  $ sl update

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/update.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/update.ts)_

<!-- commandsstop -->

---

## Architecture

### Backend Commands

Backend commands work with the ARC (Accelerated Reference Catalog) monorepo structure:

```
my-project/
├── services/         # Microservices
├── facades/          # Facade services
├── packages/         # Shared packages
└── package.json
```

### Frontend Commands

Frontend commands work with official SourceFuse boilerplates:

**Angular**: Uses [angular-boilerplate](https://github.com/sourcefuse/angular-boilerplate)

- Multi-project workspace (arc, arc-lib, arc-docs, saas-ui)
- Material Design components
- Built-in authentication and theming

**React**: Uses [react-boilerplate-ts-ui](https://github.com/sourcefuse/react-boilerplate-ts-ui)

- Vite + TypeScript
- Material-UI (MUI) components
- Redux Toolkit for state management
- RTK Query for API calls

### Template Fetching

The CLI uses a smart template fetching strategy:

1. **GitHub Fetching** (Production): Downloads templates from official repositories
2. **Version Control**: Use `--templateVersion` to pin specific template versions

### MCP Auto-Configuration

When you scaffold any project (backend, Angular, or React), the CLI automatically:

1. Creates `.claude/mcp.json` with SourceLoop CLI server configuration
2. Generates `.claude/README.md` with usage instructions
3. Configures the project for AI-assisted development

## Common Workflows

### Full-Stack Development

```bash
# 1. Create backend monorepo
sl scaffold my-fullstack-app

# 2. Add authentication microservice
cd my-fullstack-app
sl microservice auth-service --baseService=authentication-service

# 3. Create Angular admin panel
cd ..
sl angular:scaffold admin-panel

# 4. Create React customer portal
sl react:scaffold customer-portal
```

## Related Projects

- [loopback4-microservice-catalog](https://github.com/sourcefuse/loopback4-microservice-catalog) - Backend microservices
- [angular-boilerplate](https://github.com/sourcefuse/angular-boilerplate) - Angular template
- [react-boilerplate-ts-ui](https://github.com/sourcefuse/react-boilerplate-ts-ui) - React template

## License

MIT

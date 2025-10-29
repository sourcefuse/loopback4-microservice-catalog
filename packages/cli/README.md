# sourceloop-cli

This is a `sourceloop` based cli that provides commands to scaffold a monorepo, add extensions, facades and microservices to it.

## Building

To install sourceloop-cli, run

```shell
npm install @sourceloop/cli
```

Once the above command is executed, you will be able to access the CLI commands directly from your terminal. You can use either `sl` or `arc` as shorthand to run any of the `sourceloop` commands listed below. A sample usage is provided for reference:

## Usage

<!-- usage -->
```sh-session
$ npm install -g @sourceloop/cli
$ sl COMMAND
running command...
$ sl (-v|--version|version)
@sourceloop/cli/12.1.0 darwin-arm64 node-v20.19.5
$ sl --help [COMMAND]
USAGE
  $ sl COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`sl angular:config`](#sl-angularconfig)
* [`sl angular:generate [NAME]`](#sl-angulargenerate-name)
* [`sl angular:info`](#sl-angularinfo)
* [`sl angular:scaffold [NAME]`](#sl-angularscaffold-name)
* [`sl autocomplete [SHELL]`](#sl-autocomplete-shell)
* [`sl cdk`](#sl-cdk)
* [`sl extension [NAME]`](#sl-extension-name)
* [`sl help [COMMAND]`](#sl-help-command)
* [`sl mcp`](#sl-mcp)
* [`sl microservice [NAME]`](#sl-microservice-name)
* [`sl react:config`](#sl-reactconfig)
* [`sl react:generate [NAME]`](#sl-reactgenerate-name)
* [`sl react:info`](#sl-reactinfo)
* [`sl react:scaffold [NAME]`](#sl-reactscaffold-name)
* [`sl scaffold [NAME]`](#sl-scaffold-name)
* [`sl update`](#sl-update)

## `sl angular:config`

Update Angular environment configuration files

```
USAGE
  $ sl angular:config

OPTIONS
  --apiUrl=apiUrl                                 Base API URL
  --authServiceUrl=authServiceUrl                 Authentication service URL
  --clientId=clientId                             OAuth client ID
  --environment=(development|production|staging)  [default: development] Environment to update
  --help                                          Show manual pages
  --publicKey=publicKey                           Public key for authentication
```

_See code: [src/commands/angular/config.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/angular/config.ts)_

## `sl angular:generate [NAME]`

Generate Angular components, services, modules, and other artifacts

```
USAGE
  $ sl angular:generate [NAME]

ARGUMENTS
  NAME  Name of the artifact to generate

OPTIONS
  --help                                                  Show manual pages

  --path=path                                             Path where the artifact should be generated (relative to
                                                          project src/app)

  --project=project                                       [default: arc] Angular project name (arc, arc-lib, arc-docs,
                                                          saas-ui)

  --skipTests                                             Skip generating test files

  --standalone                                            Generate as a standalone component (Angular 14+)

  --type=(component|service|module|directive|pipe|guard)  Type of artifact to generate
```

_See code: [src/commands/angular/generate.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/angular/generate.ts)_

## `sl angular:info`

Display Angular project information and statistics

```
USAGE
  $ sl angular:info

OPTIONS
  --detailed  Show detailed statistics
  --help      Show manual pages
```

_See code: [src/commands/angular/info.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/angular/info.ts)_

## `sl angular:scaffold [NAME]`

Scaffold a new Angular project from ARC boilerplate

```
USAGE
  $ sl angular:scaffold [NAME]

ARGUMENTS
  NAME  Name of the project

OPTIONS
  --help                             Show manual pages
  --installDeps                      Install dependencies after scaffolding
  --localPath=localPath              Local path to template (for development)

  --templateRepo=templateRepo        [default: sourcefuse/angular-boilerplate] Custom template repository (e.g.,
                                     sourcefuse/angular-boilerplate)

  --templateVersion=templateVersion  Template version/branch to use

  --withAuth                         Include authentication module

  --withBreadcrumbs                  Include breadcrumb navigation

  --withI18n                         Include internationalization

  --withThemes                       Include theme system
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

_See code: [src/commands/cdk.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/cdk.ts)_

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

_See code: [src/commands/extension.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/extension.ts)_

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

_See code: [src/commands/mcp.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/mcp.ts)_

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
  g-service|user-tenant-service|ctrl-plane-tenant-management-service|ctrl-plane-subscription-service|ctrl-plane-orchestr
  ator-service|reporting-service)
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

_See code: [src/commands/microservice.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/microservice.ts)_

## `sl react:config`

Update React environment configuration

```
USAGE
  $ sl react:config

OPTIONS
  --appApiBaseUrl=appApiBaseUrl                                Application API base URL
  --authApiBaseUrl=authApiBaseUrl                              Authentication API base URL
  --clientId=clientId                                          OAuth client ID
  --enableSessionTimeout                                       Enable session timeout
  --expiryTimeInMinute=expiryTimeInMinute                      Session timeout in minutes
  --help                                                       Show manual pages
  --promptTimeBeforeIdleInMinute=promptTimeBeforeIdleInMinute  Prompt time before idle in minutes
  --regenerate                                                 Regenerate config.json after updating .env
```

_See code: [src/commands/react/config.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/react/config.ts)_

## `sl react:generate [NAME]`

Generate React components, hooks, contexts, pages, and other artifacts

```
USAGE
  $ sl react:generate [NAME]

ARGUMENTS
  NAME  Name of the artifact to generate

OPTIONS
  --help                                                   Show manual pages
  --path=path                                              Path where the artifact should be generated
  --skipTests                                              Skip generating test files
  --type=(component|hook|context|page|service|util|slice)  Type of artifact to generate
```

_See code: [src/commands/react/generate.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/react/generate.ts)_

## `sl react:info`

Display React project information and statistics

```
USAGE
  $ sl react:info

OPTIONS
  --detailed  Show detailed statistics
  --help      Show manual pages
```

_See code: [src/commands/react/info.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.0.0/src/commands/react/info.ts)_

## `sl react:scaffold [NAME]`

Scaffold a new React project from ARC boilerplate

```
USAGE
  $ sl react:scaffold [NAME]

ARGUMENTS
  NAME  Name of the project

OPTIONS
  --help                             Show manual pages
  --installDeps                      Install dependencies after scaffolding
  --localPath=localPath              Local path to template (for development)

  --templateRepo=templateRepo        [default: sourcefuse/react-boilerplate-ts-ui] Custom template repository (e.g.,
                                     sourcefuse/react-boilerplate-ts-ui)

  --templateVersion=templateVersion  Template version/branch to use

  --withAuth                         Include authentication module

  --withRedux                        Include Redux Toolkit state management

  --withRouting                      Include React Router

  --withThemes                       Include Material-UI theme system
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

_See code: [src/commands/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/scaffold.ts)_

## `sl update`

update the dependencies of a loopback project

```
USAGE
  $ sl update

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/update.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v12.1.0/src/commands/update.ts)_
<!-- commandsstop -->

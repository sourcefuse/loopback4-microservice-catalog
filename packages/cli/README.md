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
@sourceloop/cli/10.2.0 linux-x64 node-v20.19.3
$ sl --help [COMMAND]
USAGE
  $ sl COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`sl autocomplete [SHELL]`](#sl-autocomplete-shell)
* [`sl cdk`](#sl-cdk)
* [`sl extension [NAME]`](#sl-extension-name)
* [`sl help [COMMAND]`](#sl-help-command)
* [`sl mcp`](#sl-mcp)
* [`sl microservice [NAME]`](#sl-microservice-name)
* [`sl scaffold [NAME]`](#sl-scaffold-name)
* [`sl update`](#sl-update)

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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/master/src/commands/autocomplete/index.ts)_

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

_See code: [src/commands/cdk.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/commands/cdk.ts)_

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

_See code: [src/commands/extension.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/commands/extension.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/master/src/commands/help.ts)_

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

_See code: [src/commands/mcp.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/commands/mcp.ts)_

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
  g-service|user-tenant-service)
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

_See code: [src/commands/microservice.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/src/commands/microservice.ts)_

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

_See code: [src/commands/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/commands/scaffold.ts)_

## `sl update`

update the dependencies of a loopback project

```
USAGE
  $ sl update

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/update.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/packages/cli/src/commands/update.ts)_
<!-- commandsstop -->
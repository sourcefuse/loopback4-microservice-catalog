# sourceloop-cli

This is a `sourceloop` based cli that provides commands to scaffold a monorepo, add extensiona, facades and microservices to it.

## Building

To install sourceloop-cli, run

```shell
npm install @sourceloop/cli
```

## Usage

<!-- usage -->

```sh-session
$ npm install -g @sourceloop/cli
$ sl COMMAND
running command...
$ sl (-v|--version|version)
@sourceloop/cli/2.0.2 darwin-arm64 node-v16.14.2
$ sl --help [COMMAND]
USAGE
  $ sl COMMAND
...
```

<!-- usagestop -->

## Commands

<!-- commands -->

- [`sl autocomplete [SHELL]`](#sl-autocomplete-shell)
- [`sl extension [NAME]`](#sl-extension-name)
- [`sl microservice [NAME]`](#sl-microservice-name)
- [`sl scaffold [NAME]`](#sl-scaffold-name)
- [`sl update`](#sl-update)

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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.0/src/commands/autocomplete/index.ts)_

## `sl extension [NAME]`

add an extension

```
USAGE
  $ sl extension [NAME]

ARGUMENTS
  NAME  name of the extension

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/extension.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v2.4.3/src/commands/extension.ts)_

## `sl microservice [NAME]`

add a microservice

```
USAGE
  $ sl microservice [NAME]

ARGUMENTS
  NAME  name of the microservice

OPTIONS
  -p, --uniquePrefix=uniquePrefix
      unique prefix to be used for docker images

  -s,
  --baseService=(authentication-service|audit-service|chat-service|notification-service|bpmn-service|feature-toggle-serv
  ice|in-mail-service|payment-service|scheduler-service|search-service|video-conferencing-service|user-tenant-service)
      base sourceloop microservice

  --[no-]baseOnService
      base on sourceloop microservice or not

  --customMigrations
      setup custom migration for this microservice

  --datasourceName=datasourceName
      name of the datasource to generate

  --datasourceType=(postgres|mysql)
      type of the datasource

  --[no-]facade
      create as facade

  --help
      show manual pages

  --includeMigrations
      include base microservice migrations
```

_See code: [src/commands/microservice.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v2.4.3/src/commands/microservice.ts)_

## `sl scaffold [NAME]`

create a project scaffold

```
USAGE
  $ sl scaffold [NAME]

ARGUMENTS
  NAME  name of the project

OPTIONS
  --cwd=cwd                  directory where project will be scaffolded, instead of the project name
  --help                     show manual pages
  --integrateWithBackstage   Do you want to include backstage integration files?
  --issuePrefix=issuePrefix  prefix to be used for issues(e.g. GH-)
  --owner=owner              owner of the repo
```

_See code: [src/commands/scaffold.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v2.4.3/src/commands/scaffold.ts)_

## `sl update`

update the dependencies of a loopback project

```
USAGE
  $ sl update

OPTIONS
  --help  show manual pages
```

_See code: [src/commands/update.ts](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/v2.4.3/src/commands/update.ts)_

<!-- commandsstop -->

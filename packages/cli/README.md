# sourceloop-cli
This is a POC of a CLI that will work similarly to the `lb4` cli. The `sourceloop-cli` will perform similar scaffolding functions for `Sourceloop` based projects.

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
@sourceloop/cli/1.2.1 darwin-arm64 node-v16.14.2
$ sl --help [COMMAND]
USAGE
  $ sl COMMAND
...
```
<!-- usagestop -->

## Commands
<!-- commands -->
* [`sl autocomplete [SHELL]`](#sl-autocomplete-shell)

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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.2.0/src/commands/autocomplete/index.ts)_
<!-- commandsstop -->

# sourceloop-cli
This is a POC of a CLI that will work similarly to the `lb4` cli. The `sourceloop-cli` will perform similar scaffolding functions for `Sourceloop` based projects.

## Building
To install sourceloop-cli, run

```shell
npm install @sourceloop/cli
```

## Usage
Since the CLI is a POC, only one command is currently implemented that is specfic to `Sourceloop`. The CLI currently wraps the `lb4` CLI.

`lb4` CLI
```shell
sl lb4
```

Sourceloop CLI
    To start setting up of project
```shell
sl scaffold
```

Microservice 
    To create microservice with all the dependencies installed run this command in services folder
```shell
sl microservice
```

Extension 
    To create extension run this command in packages folder
```shell
sl extension
```
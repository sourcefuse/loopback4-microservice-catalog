# sourceloop-cli
This is a POC of a CLI that will work similarly to the `lb4` cli. The `sourceloop-cli` will perform similar scaffolding functions for `Sourceloop` based projects.

## Building
From the root of the package, run
```shell
npm pack
```
which will output a `tar` file. You can then install the package globally or in another project.

```shell
npm install -g sourceloop-cli-0.1.0.tgz
```

## Usage
Since the CLI is a POC, only one command is currently implemented that is specfic to `Sourceloop`. The CLI currently wraps the `lb4` CLI.

`lb4` CLI
```shell
sourceloop-cli lb4
```

Sourceloop CLI
```shell
sourceloop-cli sl project
```
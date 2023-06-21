# <%= name %>

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Getting Started

We develop all microservices in the same repository using monorepo concept. To setup the base of the project we are using [Lerna](https://github.com/lerna/lerna). Lerna is useful to manage monorepos.

## Developing

For development guidelines, refer [here](https://github.com/sourcefuse/biz-book-api/tree/master/DEVELOPING.md)

## Commit message guidelines

A good commit message should describe what changed and why.

Our commit messages are formatted according to
[Conventional Commits](https://conventionalcommits.org/), we use
[commitlint](https://github.com/marionebl/commitlint) to verify and enforce this
convention. These rules lead to more readable messages that are easy to follow
when looking through the project history. But also, we use the git commit
messages to generate change logs when publishing new versions.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The
header has a special format that includes a **type**, an optional **scope** and
a **subject**:

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### type

The **type** must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Changes to the auxiliary tools and libraries such as documentation
  generation
- **revert**: Reverts a previous commit

#### scope

The **scope** must be a list of one or more packages contained in this monorepo.
Each scope name must match a directory name in
[packages/](https://github.com/sourcefuse/biz-book-api/tree/master/packages),
e.g. `core` or [services/](https://github.com/sourcefuse/biz-book-api/tree/master/services).

_Note: If multiple packages are affected by a pull request, don't list the
scopes as the commit linter currently only supports only one scope being listed
at most._

#### subject

The **subject** contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### body

The **body** provides more details, it should include the motivation for the
change and contrast this with previous behavior.

Just as in the subject, use the imperative, present tense: "change" not
"changed" nor "changes"a

Paragraphs or bullet points are ok (must not exceed 100 characters per line).
Typically a hyphen or asterisk is used for the bullet, followed by a single
space, with blank lines in between.

#### references

Its mandatory to add references to JIRA ticket you are resolving as part of the commit.

#### footer (optional)

The **footer** should contain any information about Breaking Changes introduced
by this commit.

This section must start with the upper case text `BREAKING CHANGE` followed by a
colon (`:`) and a space (``). A description must be provided, describing what
has changed and how to migrate from older versions.

### Tools to help generate a commit message

This repository has [commitizen](https://github.com/commitizen/cz-cli) support
enabled. Commitizen can help you generate your commit messages automatically.

And to use it, simply call `git commit`. The tool will help
you generate a commit message that follows the above guidelines.

## Releases

We are using semantic versioning so, the release management and tagging is automated based on that.

Since, we are using a monorepo with lerna, each microservice will have independent versioning and release. For identifying which services changed in any build cycle and deploy only those services using CI/CD pipeline, use the below commands in order.

```sh
lerna changed -p --toposort --loglevel silent
```

This will give modified services for selective deployment. This needs to be done at beginning of CD process. This will skip migrations. So that needs to be run everytime. `lerna run db:migrate` .

Alternatively, We can also use `--since {commit-hash}` flag with `lerna run` command to let lerna know that execute the command only in the services which have changed since the commit hash provided.

Command for releasing tags

Pre-release

```sh
HUSKY_SKIP_HOOKS=1 lerna version --conventional-commits --conventional-prerelease
```

Release

```sh
HUSKY_SKIP_HOOKS=1 lerna version --conventional-commits --conventional-graduate
```
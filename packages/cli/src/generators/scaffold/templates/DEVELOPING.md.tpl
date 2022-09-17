# Developing Microservices

This document describes how to develop microservices living in loopback4-microservice-catalog monorepo.

- [Setting up development environment](#setting-up-development-environment)
- [Setup Codebase](#setup-codebase)
- [Building the project](#building-the-project)
- [File naming convention](#file-naming-convention)
- [Develop a new microservice](#develop-a-new-microservice)
- [How to upgrade to new LB4 dependencies](#how-to-upgrade-to-new-lb4-dependencies)
- [Sonar Setup in VS Code](#sonar-setup-in-vs-code)
- [Commit message guidelines](#commit-message-guidelines)
- [Husky setup for commit hooks](#husky-setup-for-commit-hooks)

## Setting up development environment

We recommend our contributors to use
[VisualStudio Code](https://code.visualstudio.com/) with the following
extensions installed:

- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  for automatic formatting of source files on save.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  to highlight and auto-fix linting problems directly in the editor.
- [SonarLint for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
- [TypeScript Hero](https://marketplace.visualstudio.com/items?itemName=rbbit.typescript-hero)

Our monorepo comes with few preconfigured
[VSCode Tasks](https://code.visualstudio.com/docs/editor/tasks):

- The build task is configured to run the TypeScript compiler
- The test task is configured to run `npm test` (which runs the build before
  running any tests).

## Setup Codebase

1. Open root folder of this repo in VS Code.
2. Install lerna globally `npm i -g lerna`
3. Run `lerna bootstrap`
4. Run `npm i`
5. Create .env files for all the micro service packages.
6. Run DB migrations using `lerna run db:migrate`.
7. Build all microservices in one go - `lerna run build`.
8. Run `lerna run start` to start all the micro services in one go.

## Building the project

Whenever you pull updates from GitHub or switch between feature branches, make
sure to updated installed dependencies in all monorepo packages. The following
command will install npm dependencies for all packages and create symbolic links
for intra-dependencies:

```sh
lerna bootstrap
```

As part of `lerna bootstrap`, TypeScript project references are automatically
updated for each package with in the monorepo.

The next step is to compile all packages from TypeScript to JavaScript:

```sh
lerna run build
```

To force a clean build:

```sh
lerna clean && lerna run build
```

Please note that `npm run clean` removes `dist`, `*.tsbuildinfo`, and other
generated files from each package to clean the state for builds.

To build an individual package:

```sh
cd <package-dir> // For example, cd `packages/core`.
npm run build
```

<!-- ### Using monorepo packages as dependencies

The `/sandbox` directory in the monorepo can be used to utilize the source code
as symbolically-linked dependencies. See the
[README](https://github.com/strongloop/loopback-next/blob/master/sandbox/README.md)
for usage instructions. -->

### Linting and formatting

We use two tools to keep our codebase healthy:

- [ESLint](https://typescript-eslint.io/) to statically analyse our source code
  and detect common problems.
- [Prettier](https://prettier.io/) to keep our code always formatted the same
  way, avoid style discussions in code reviews, and save everybody's time an
  energy.

You can run both linters via the following npm script, just keep in mind that
`lerna run test` is already running them for you.

```sh
lerna run lint
```

Many problems (especially formatting) can be automatically fixed by running the
npm script `lint:fix`.

```sh
lerna run lint:fix
```

### Adding dependencies

Use the following command to add or update dependency `dep` in a package `name`:

```sh
$ npx lerna add --scope ${name} ${dep}
```

For example:

```sh
$ npx lerna add --scope @loopback/rest debug
```

See [lerna add](https://github.com/lerna/lerna/blob/master/commands/add#readme)
for more details.

## File naming convention

For consistency, we follow
[Angular's file naming convention](https://angular.io/guide/styleguide#separate-file-names-with-dots-and-dashes).
It helps to derive the usage of files by inspecting the names. Besides the
LoopBack 4 codebase, we also follow this naming convention in our generated
artifacts from the CLI tooling: `{name}`.`{artifact-type}`.ts

Examples are:

```
src/decorators/authenticate.decorator.ts
src/boot.component.ts
```

In addition, files under `test` folder are categorized according to the type of
tests (unit, acceptance and integration), with the convention
`{name}.{test-type}.ts`.

Examples are:

```
src/__tests__/acceptance/application.acceptance.ts
src/__tests__/integration/user.controller.integration.ts
src/__tests__/unit/application.unit.ts
```

## Develop a new microservice

1. **lb4 <service_name>** - Generate a new loopback-next application under the required folder, either facades or services.
2. **.dockerignore** - Replace node_modules with coverage
3. **.prettierignore** - Add coverage
4. **.eslintrc.js** - Just copy below as is

   ```json
     module.exports = {
       extends: '@loopback/eslint-config',
       rules: {
         'no-extra-boolean-cast': 'off',
         '@typescript-eslint/interface-name-prefix': 'off',
         'no-prototype-builtins': 'off',
       },
       parserOptions: {
         project: './tsconfig.json',
         tsconfigRootDir: __dirname,
       },
     };
   ```

5. **Necessary deps** - Add symlink-resolver package to devDependencies

   ```sh
   lerna add -D symlink-resolver --scope={service name}
   ```

   then add these two in scripts of package.json

   ```json
   "symlink-resolver": "symlink-resolver",
   "resolve-links": "npm run symlink-resolver build ./node_modules",
   ```

6. **Dotenv** - Add dotenv packages for environment keys handling. Run below

   ```sh
   lerna add dotenv --scope={service name}
   lerna add dotenv-extended --scope={service name}
   lerna add -D @types/dotenv --scope={service name}
   ```

7. **Env files** - Add .env.defaults and .env.example and specify required keys
8. **Load .env** - Add below code to the top of `application.ts` before super call.

   ```ts
   const port = 3000;
   dotenv.config();
   dotenvExt.load({
     schema: '.env.example',
     errorOnMissing: true,
     includeProcessEnv: true,
   });
   options.rest = options.rest || {};
   options.rest.port = +(process.env.PORT || port);
   options.rest.host = process.env.HOST;
   ```

   Import dotenv related packages

   ```ts
   import * as dotenv from 'dotenv';
   import * as dotenvExt from 'dotenv-extended';
   ```

9. **Add Sourceloop core** - Add @sourceloop/core as dependency to the module

   ```sh
   lerna add @sourceloop/core --scope={service name}
   ```

In application.ts,

```ts
import {CoreComponent, ServiceSequence} from '@sourceloop/core';

this.component(CoreComponent);

// Set up the custom sequence
this.sequence(ServiceSequence);
```

10. **Bearer Verifier** - Add bearer verifier to your service

```sh
lerna add loopback4-authentication --scope={service name}
lerna add loopback4-authorization --scope={service name}
```

Add below to application.ts

```ts
  ...
  import {AuthenticationComponent} from 'loopback4-authentication';
  import {
  AuthorizationBindings,
  AuthorizationComponent,
  } from 'loopback4-authorization';
  import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  } from '@sourceloop/core';
  ...
    // Add authentication component
  this.component(AuthenticationComponent);

  // Add bearer verifier component
  this.bind(BearerVerifierBindings.Config).to({
    authServiceUrl: '',
    type: BearerVerifierType.service,
  } as BearerVerifierConfig);
  this.component(BearerVerifierComponent);

  // Add authorization component
  this.bind(AuthorizationBindings.CONFIG).to({
    allowAlwaysPaths: ['/explorer'],
  });
  this.component(AuthorizationComponent);
```

Use BearerVerifierType.facade for facades.

11. **Setup project for test coverage** -

    Create a file named .nycrc and copy this data in it

    ```json
    {
      "extends": "@istanbuljs/nyc-config-typescript",
      "all": true,
      "reporter": ["html", "text-summary"]
    }
    ```

    Install nyc for coverage reporting

    ```sh
      lerna add -D @istanbuljs/nyc-config-typescript --scope={service name}
      lerna add -D nyc --scope={service name}
    ```

    then add these in scripts of package.json

    ```json
    "coverage": "nyc npm run test",
    ```

12. **Setup sequence** - Remove auto-generated sequence.ts and change to ServiceSequence in application.ts.
13. **Fix api explorer** - Update base path in index.html for facades.

```html
<body>
  <div class="info">
    <h1>auth-facade</h1>
    <p>Version 1.0.0</p>

    <h3>OpenAPI spec: <a href="${basePath}/openapi.json">/openapi.json</a></h3>
    <h3>API Explorer: <a href="${basePath}/explorer">/explorer</a></h3>
  </div>

  <footer class="power">
    <a href="https://v4.loopback.io" target="_blank">
      <img
        src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png"
        alt="Powered by loopback"
      />
    </a>
  </footer>
</body>
```

14. **Update home-page.controller.ts** - Update the home-page.controller.ts with base path related changes, only in facades.

```ts
this.html = fs.readFileSync(
  path.join(__dirname, '../../public/index.html'),
  'utf-8',
);
// Replace base path placeholder from env
this.html = this.html.replace(/\$\{basePath\}/g, process.env.BASE_PATH ?? '');
```

Create home-page.controller.ts if not already there.

## How to upgrade to new LB4 dependencies

1. Upgrade LB4 CLI version first. Use `npm i -g @loopback/cli@latest`.
2. Run `npm i` at project root. This step is mandatory if node.js or npm version support is also needed to upgrade.
3. Upgrade any deps, if needed, at project root. Verify it in the package.json at root. If not needed, skip this step.
4. Navigate to core package. `cd packages/core`.
5. Run `lb4 update`. It will prompt you to confirm the deps upgrade. Verify it carefully and confirm. Let it overwrite package.json.
6. There may be some errors in previous step if there are any breaking changes coming in. If that's so, then, delete package-lock.json and run `npm i` again.
7. Upgrade any other package related, like, loopback4 extensions - loopback4-authentication, etc. In order to ensure upgrade works, all the extensions should support the upgraded LB4 version. For example, `npm i loopback4-authentication@latest loopback4-authorization@latest loopback4-soft-delete@latest tslib@latest loopback-connector-postgresql@latest`.
8. Run `npm audit fix`, if needed.
9. Run `npm run test` to validate upgrade.
10. Now, navigate to individual services. `cd ../../services/audit-service`.
11. Re-execute steps 5-8 again.
12. Before doing test, we need to update the `@sourceloop/core` with local symlinked package. Run `lerna bootstrap --force-local --scope=@sourceloop/audit-service`.
13. Now run `npm run test` to validate upgrade.
14. Repeat steps 10-13 for each service.

After all the steps above done for all services and core package, all your deps are upgraded and tested. You can commit and push them to be released. Make sure to mention any breaking changes if any of the deps upgrade had breaking change.

## Sonar Setup in VS Code

1. Go to [Sonar Cloud](https://sonarcloud.io/)
2. Login with your SF Github ID
3. Go to `My Account` from top-right user profile menu.
4. Move to `Security` tab.
5. Add a recognizable token name and click on `Generate token`
6. Install Sonarlint extension in VS Code IDE
7. Open Settings in VS Code IDE
8. Search for `sonarlint` using search box at the top
9. Look for `Sonarlint › Connected Mode: Servers`
10. Click on `Edit in settings.json`. settings.json under system user directory will open.
11. Add the below configuration

```json
  "sonarlint.connectedMode.servers": [
    {
      "serverId": "sf_sonar", // Connection identifier
      "serverUrl": "https://sonarcloud.io/", // SonarQube/SonarCloud URL - https//sonarcloud.io for SonarCloud
      "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "organizationKey": "sourcefuse-cloud"
    }
  ],
```

Replace value of token with your own user token generated in step 5 from sonar cloud.

**Note** - Sonarlint requires latest java runtime. Please install if not done already.

Close and reopen VS Code.

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
[packages/](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/packages),
e.g. `core`.

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

## Husky setup for commit hooks

- run `npm i` at the root of the project
- run `npx husky install` or `npm run prepare` at the root of the project

### Tools to help generate a commit message

This repository has [commitizen](https://github.com/commitizen/cz-cli) support
enabled. Commitizen can help you generate your commit messages automatically.

And to use it, simply call `git commit`. The tool will help
you generate a commit message that follows the above guidelines.
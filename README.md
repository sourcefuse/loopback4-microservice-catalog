# Sourceloop

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

![@loopback/core](https://img.shields.io/github/package-json/dependency-version/sourcefuse/loopback4-microservice-catalog/@loopback/core?filename=packages%2Fcore%2Fpackage.json)

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=sourcefuse_loopback4-microservice-catalog)](https://sonarcloud.io/summary/new_code?id=sourcefuse_loopback4-microservice-catalog)

<!-- docs-index-start -->

The `Sourceloop` is a collection of pre-built microservices that aim to reduce time to market for enterprise projects. Large enterprises usually face a similar set of challenges when developing cloud native platforms as part of digital transformation efforts or the creation of new products. The services are implemented as [LoopBack Extensions](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html), allowing you to install them into existing LoopBack applications or use the [LoopBack Command-line interface](https://loopback.io/doc/en/lb4/Command-line-interface.html) to generate standalone services. Our recommended approach is to deploy these services as standalone micro-services in Docker.

The current catalog consists of the following services:

- [audit-service](services/audit-service)
- [authentication-service](services/authentication-service)
- [in-mail-service](services/in-mail-service)
- [notification-service](services/notification-service)
- [scheduler-service](services/scheduler-service)
- [video-conferencing-service](services/video-conferencing-service)
- [bpmn-service](services/bpmn-service)
- [chat-service](services/chat-service)
- [feature-toggle-service](services/feature-toggle-service)
- [payment-service](services/payment-service)
- [search-service](services/search-service)

This repository also contains a set of example projects in the [sandbox](sandbox) directory that can be run from `docker-compose`.

- [audit-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/audit-ms-example)
- [auth-multitenant-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/auth-multitenant-example)
- [auth-ms-basic-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/auth-ms-basic-example)
- [notification-socket-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/notification-socket-example)
- [workflow-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/workflow-ms-example)
- [audit-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/audit-ms-example)
- [in-mail-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/in-mail-example)
- [scheduler-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/scheduler-example)
- [video-conferencing-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/video-conferencing-ms-example)
- [chat-notification-pubnub-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/chat-notification-pubnub-example)
- [feature-toggle-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/feature-toggle-example)
- [payment-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/payment-example)
- [search-client-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/search-client-example)
- [search-ms-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/search-ms-example)
- [user-onboarding-example](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/sandbox/user-onboarding-example)

## Table of Contents

- [Sourceloop](#Sourceloop)
  - [Table of Contents](#table-of-contents)
    - [Long Term Support](#long-term-support)
    - [Documentation](#documentation)
    - [Getting Started](#getting-started)
    - [Production Deployment](#production-deployment)
    - [Related Projects](#related-projects)
    - [Feedback](#feedback)
    - [Contributing](#contributing)
    - [Code of Conduct](#code-of-conduct)
    - [License](#license)

### Long Term Support

TODO: Establish LTS policy or document here that the catalog is still in development and has not reached an LTS release yet.

| Version | Status | Published | EOL |
| ------- | ------ | --------- | --- |
|         |        |           |     |

### Documentation

- [LoopBack| LoopBack Documentation](https://loopback.io/doc/en/lb4/)
- [Extending LoopBack | LoopBack Documentation](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html)

### Getting Started

For specifics of installing and configuring a particular service, please refer to that service's documentation. The guide here is intended to show the general method for installing and configuring the services. We are going to utilize a fictional service, `@sourceloop/example-service`, as an example. All services load their environment configurations using `dotenv` and `dotenv-extended`.

Install the Loopback4 CLI

```bash
npm install -g @loopback/cli
```

Generate an application (If you don't have one already).

```bash
lb4 app
? Project name: example-application
? Project description: Example Application For SourceLoop
? Project root directory: example-application
? Application class name: ExampleApplicationApplication
? Select features to enable in the project Enable eslint, Enable prettier, Enable mocha, Enable loopbackBuild, Enable vs
code, Enable docker, Enable repositories, Enable services
    force .yo-rc.json
   create .eslintignore
   create .eslintrc.js
   create .mocharc.json
   create .npmrc
   create .prettierignore
   create .prettierrc
   create DEVELOPING.md
   create package.json
   create tsconfig.json
   create .vscode\launch.json
   create .vscode\settings.json
   create .vscode\tasks.json
   create .gitignore
   create .dockerignore
   create Dockerfile
   create README.md
   create public\index.html
   create src\application.ts
   create src\index.ts
   create src\migrate.ts
   create src\openapi-spec.ts
   create src\sequence.ts
   create src\controllers\index.ts
   create src\controllers\ping.controller.ts
   create src\controllers\README.md
   create src\datasources\README.md
   create src\models\README.md
   create src\repositories\README.md
   create src\__tests__\README.md
   create src\__tests__\acceptance\home-page.acceptance.ts
   create src\__tests__\acceptance\ping.controller.acceptance.ts
   create src\__tests__\acceptance\test-helper.ts
npm WARN deprecated debug@4.2.0: Debug versions >=3.2.0 <3.2.7 || >=4 <4.3.1 have a low-severity ReDos regression when used in a Node.js environment. It is recommended you upgrade to 3.2.7 or 4.3.1. (https://github.com/visionmedia/debug/issues/797)
npm WARN deprecated fsevents@2.1.3: "Please update to latest v2.3 or v2.2"
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules\chokidar\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
npm WARN example-application@0.0.1 No license field.

added 637 packages from 816 contributors and audited 646 packages in 16.345s

87 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities


Application example-application was created in example-application.

Next steps:

$ cd example-application
$ npm start
```

Install `dotenv`, `dotenv-extended` and `@sourceloop/example-service`.

```bash
cd example-application
npm i --save dotenv dotenv-extended @sourceloop/example-service
touch .env.example
```

Update `src/application.ts` to use the new service component and the environment variables. You may also need to bind configurations depending on the service component you are using. You find these configurations in the individual README of the service.

```typescript
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {ExampleServiceComponent} from '@sourceloop/example-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

export {ApplicationConfig};

const port = 3000;
export class ExampleApplicationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(ExampleServiceComponent); // OUR EXAMPLE SERVICE COMPONENT

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
```

Modify the environment variable file to have the following contents:

```
NODE_ENV=dev
```

You can now run the example service with `npm start`.

### Config Hidden APIs

Update `src/application.ts` of each service to use the new hidden api feature. Add the following lines

```typescript
import {OperationSpecEnhancer} from './enhancer/operationSpecEnhancer';
import {OASBindings} from './keys';
import {HttpMethod} from './enums/http-oas.enum';

export class ExampleApplicationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Bind OASBinding namespace to hide APIs
    this.bind(OASBindings.HiddenEndpoint).to([
      {httpMethod: HttpMethod.GET, path: '/ping'},
      {httpMethod: HttpMethod.POST, path: '/customers/{id}/users'},
      {httpMethod: HttpMethod.PUT, path: '/roles/{id}'},
    ]);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
```

### DataSources and Migrations

The `Sourceloop` can support any Loopback 4 [DataSource](https://loopback.io/doc/en/lb4/DataSource.html). While you may see existing `DataSources`, it is not mandatory to use them.

The migrations required for this service are processed during the installation automatically if you set the `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databases, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

### Production Deployment

Inside of the `sandbox` folder, you will find example applications and Dockerfiles for each application. The `Sourceloop` is agnostic of the Docker deployment strategy. Deploy the services into the platform of your choice.

## Sandbox

`sandbox` folder contains example applications and docker files that can be run independently to see the services in action. You can use [Docker Compose](https://docs.docker.com/compose/) to run the sandbox applications.

## Sourceloop CLI

The Sourceloop CLI is a command-line interface tool that one use to initialize, develop, scaffold, and maintain sourceloop applications directly from a command shell. Learn more about [Sourceloop CLI](packages/cli/README.md).

### Related Projects

The `Sourceloop` utilizes many extensions created by SourceFuse.

- [sourcefuse/loopback4-ratelimiter: A rate limiting extension for loopback4 applications (github.com)](https://github.com/sourcefuse/loopback4-ratelimiter)
- [sourcefuse/loopback4-notifications: An extension for setting up various notification mechanisms in loopback4 application, vis-a-vis, Push notification, SMS notification, Email notification (github.com)](https://github.com/sourcefuse/loopback4-notifications)
- [sourcefuse/loopback4-s3: A loopback4 extension for AWS S3 integration (github.com)](https://github.com/sourcefuse/loopback4-s3)
- [sourcefuse/loopback4-audit-log: A loopback-next extension for implementing audit logs in loopback applications for all DB transactions. (github.com)](https://github.com/sourcefuse/loopback4-audit-log)
- [sourcefuse/loopback4-soft-delete: A loopback4 extension for soft delete feature (github.com)](https://github.com/sourcefuse/loopback4-soft-delete)
- [sourcefuse/loopback4-authentication: A loopback-next extension for authentication feature. Oauth strategies supported. (github.com)](https://github.com/sourcefuse/loopback4-authentication)
- [sourcefuse/loopback4-authorization: An authorization extension for loopback4 applications (github.com)](https://github.com/sourcefuse/loopback4-authorization)
- [sourcefuse/loopback4-helmet: A loopback4 extension for helmetjs integration (github.com)](https://github.com/sourcefuse/loopback4-helmet)
- [sourcefuse/loopback4-vault: A loopback-next extension for HashiCorp's Vault integration in loopback-next applications (github.com)](https://github.com/sourcefuse/loopback4-vault)
- [sourcefuse/loopback4-kafka-client: A Kafka Client for Loopback4 built on top of KafkaJS (github.com)](https://github.com/sourcefuse/loopback4-kafka-client)
- [sourcefuse/loopback4-dynamic-datasource: A loopback 4 extension to connect to dynamic data sources runtime while maintaining old connections (github.com)](https://github.com/sourcefuse/loopback4-dynamic-datasource)
- [sourcefuse/loopback4-sequelize: A Loopback 4 Extension that provides Sequelize query builder at repository level (github.com)](https://github.com/sourcefuse/loopback4-sequelize)

### Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker]([Issues · sourcefuse/loopback4-microservices-catalog · GitHub](https://github.com/sourcefuse/loopback4-microservice-catalog/issues)) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)! All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can. If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

### Contributing

- [Development Guidelines](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/DEVELOPING.md)

### Code of Conduct

Code of conduct guidelines [here.](CODE_OF_CONDUCT.md)

### License

[MIT](LICENSE)

<!-- docs-index-end -->

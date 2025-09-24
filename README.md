<p align="center">
  <a href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" width="180" alt="ARC Logo" /></a>
</p>

<p align="center">
  ARC by SourceFuse is an open-source Rapid Application Development framework for developing cloud-native enterprise applications, utilizing prebuilt microservices and standardized architectures for deployment on private and public clouds.
</p>

<p align="center">
<a href="https://sonarcloud.io/summary/new_code?id=sourcefuse_loopback4-microservice-catalog" target="_blank">
<img alt="Sonar Quality Gate" src="https://img.shields.io/sonar/quality_gate/sourcefuse_loopback4-microservice-catalog?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge">
</a>
<a href="./LICENSE">
<img src="https://img.shields.io/github/license/sourcefuse/loopback4-microservice-catalog?style=for-the-badge" alt="License" />
</a>
<a href="https://github.com/sourcefuse/loopback4-microservice-catalog/graphs/contributors" target="_blank">
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/sourcefuse/loopback4-microservice-catalog?style=for-the-badge">
</a>
<a href="https://www.npmjs.com/~sourceloop" target="_blank">
  <img alt="sourceloop core downloads" src="https://img.shields.io/npm/dm/@sourceloop/core?style=for-the-badge">
</a>
<a href="https://loopback.io/" target="_blank">
  <img alt="Pb Loopback" src="https://img.shields.io/badge/Powered%20by-Loopback 4-brightgreen?style=for-the-badge" />
</a>
<a href="https://nestjs.com/" target="_blank">
  <img alt="Pb Loopback" src="https://img.shields.io/badge/Compatible%20With-NestJS-brightgreen?style=for-the-badge" />
</a>

</p>

## IMPORTANT NOTE

From v5 onwards our cli now supports workspaces, transfering the responsibility of managing dependencies from lerna to npm. We will be providing support for our older version v4 till 30th June 2024. For more details on how to migrate from older versions of lerna to latest lerna v7 [click here](https://lerna.js.org/docs/legacy-package-management).

# ARC API

ARC API (aka Sourceloop), is a collection of pre-built microservices designed to accelerate the development timeline for enterprise projects. These services address common challenges encountered by large enterprises during the development of cloud-native platforms for digital transformation initiatives or new product creation.Implemented as [LoopBack Extensions](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html), ARC API services can be seamlessly integrated into existing LoopBack or NestJS applications or generated as standalone services using the LoopBack Command-line interface.

> Watch our [introduction video](https://youtu.be/7_mReOx8RT0) to know more about ARC API.

## Getting Started

The easiest way to get started with ARC API is to use its command line interface which can be installed using `npm install -g @sourceloop/cli`. The cli provides quick ways to scaffold a monorepo project, add microservices provided by sourceloop to your projects and many other useful stuff.

> Checkout this step by step tutorial [here](packages/cli/tutorial.md).

## Pre-built Micro-services

There are currently 14 Microservices provided and actively maintained:

1. [Authentication Service](services/authentication-service)
2. [Audit Service](services/audit-service)
3. [OIDC Service](services/oidc-service)
4. [In-Mail Service](services/in-mail-service)
5. [Notification Service](services/notification-service)
6. [Scheduler Service](services/scheduler-service)
7. [Video Conferencing Service](services/video-conferencing-service)
8. [BPMN Service](services/bpmn-service)
9. [Chat Service](services/chat-service)
10. [Feature Toggle Service](services/feature-toggle-service)
11. [User Service](services/user-tenant-service)
12. [Payment Service](services/payment-service)
13. [Survey Service](services/survey-service)
14. [Search Service](services/search-service)

## Other Extensions

ARC API utilizes many LoopBack extensions in the micro-services provided, which are actively maintained by the ARC team.

<table>
  <tr>
    <th>Package Name</th>
    <th>Repo</th>
    <th>NPM</th>
  </tr>
  <tr>
    <td>loopback4-authentication</td>
    <td><a href="https://github.com/sourcefuse/loopback4-authentication">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-authentication">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-authorization</td>
    <td><a href="https://github.com/sourcefuse/loopback4-authorization">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-authorization">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-ratelimiter</td>
    <td><a href="https://github.com/sourcefuse/loopback4-ratelimiter">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-ratelimiter">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-s3</td>
    <td><a href="https://github.com/sourcefuse/loopback4-s3">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-s3">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-soft-delete</td>
    <td><a href="https://github.com/sourcefuse/loopback4-soft-delete">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-soft-delete">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-kafka-client</td>
    <td><a href="https://github.com/sourcefuse/loopback4-kafka-client">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-kafka-client">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-helmet</td>
    <td><a href="https://github.com/sourcefuse/loopback4-helmet">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-helmet">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-notifications</td>
    <td><a href="https://github.com/sourcefuse/loopback4-notifications">GitHub</a></td>
    <td><a href="https://npmjs.com/package/loopback4-notifications">NPM</a></td>
  </tr>
  <tr>
    <td>@sourceloop/audit-log</td>
    <td><a href="https://github.com/sourcefuse/loopback4-audit-log">GitHub</a></td>
    <td><a href="https://npmjs.com/package/@sourceloop/audit-log">NPM</a></td>
  </tr>
  <tr>
    <td>@sourceloop/vault</td>
    <td><a href="https://github.com/sourcefuse/loopback4-vault">GitHub</a></td>
    <td><a href="https://npmjs.com/package/@sourceloop/vault">NPM</a></td>
  </tr>
   <tr>
    <td>@loopback/sequelize</td>
    <td><a href="https://github.com/loopbackio/loopback-next/tree/master/extensions/sequelize">GitHub</a></td>
    <td><a href="https://npmjs.com/package/@loopback/sequelize">NPM</a></td>
  </tr>
  <tr>
    <td>loopback4-billing</td>
    <td><a href="https://github.com/sourcefuse/loopback4-billing">GitHub</a></td>
    <td><a href="https://www.npmjs.com/package/loopback4-billing">NPM</a></td>
  </tr>
    <tr>
    <td>lb4-llm-chat-component</td>
    <td><a href="https://github.com/sourcefuse/llm-chat-component">GitHub</a></td>
    <td><a href="https://www.npmjs.com/package/lb4-llm-chat-component">NPM</a></td>
  </tr>
</table>

## Example Implementations

The [sandbox](./sandbox/) folder contains example applications and docker files that can be run independently to see the services in action. You can use [Docker Compose](https://docs.docker.com/compose/) to run the sandbox applications.

## Issues

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)! All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can. If you think this project is useful, please star it. Appreciation really helps in keeping this open source project alive.

## Consulting

Let's talk about accelerating your next project with ARC API:

https://www.sourcefuse.com/lets-talk/

## People

### Contributors

- [@samarpan-b](http://github.com/samarpan-b) (Project Architect)
- [@akshatdubeysf](http://github.com/akshatdubeysf)
- [@yeshamavani](http://github.com/yeshamavani)
- [@shubhamp-sf](http://github.com/shubhamp-sf)
- [@barleendhaliwal](http://github.com/barleendhaliwal)
- [@AnkurBansalSF](http://github.com/AnkurBansalSF)
- [@Surbhi-sharma1](http://github.com/Surbhi-sharma1)
- [@Tyagi-Sunny](http://github.com/Tyagi-Sunny)
- [@antriksha102](http://github.com/antriksha102)
- [@arpit1503khanna](http://github.com/arpit1503khanna)

See [all contributors](https://github.com/sourcefuse/loopback4-microservice-catalog/graphs/contributors).

## Reference Links

- https://www.sourcefuse.com/arc-by-sourcefuse/

- https://loopback.io/doc/en/lb4/
- https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html
- https://fourtheorem.com/monorepo/
- https://semaphoreci.com/blog/release-management-microservices

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

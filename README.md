# loopback4-microservice-catalog

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

The `loopback4-microservice-catalog` is a collection of pre-built microservices that aim to reduce time to market for Enterprise projects. Large enterprises usually face a similar set of challenges when developing cloud native platforms as part of digital transformation efforts or the creation of new products. The services are implemented as [LoopBack4 Extensions](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html), allowing you to install them into existing LoopBack4 applications or use the [LoopBack 4 Command-line interface](https://loopback.io/doc/en/lb4/Command-line-interface.html) to generate standalone services. Our recommended approach is to deploy these services as standalone micro-services in Docker.

The current catalog consists of the following services (TODO: link to readmes):

* audit-service
* authentication-service
* in-mail-service
* notification-service
* scheduler-service
* video-conferencing-service

TODO: note roadmap for upcoming services, infrastructure modules that are available, etc.

## Table of Contents

[TOC]

### Long Term Support

TODO: Establish LTS policy or document here that the catalog is still in development and has not reached an LTS release yet.

| Version | Status | Published | EOL  |
| ------- | ------ | --------- | ---- |
|         |        |           |      |

### Documentation

* [LoopBack 4 | LoopBack Documentation](https://loopback.io/doc/en/lb4/)
* [Extending LoopBack 4 | LoopBack Documentation](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html)

### Getting Started

TODO: Point to starter app but provide basic walkthrough from the start using the lb4 CLI

### Related Projects

The `loopback4-microservice-catalog` utilizes many extensions created by SourceFus

* [sourcefuse/loopback4-ratelimiter: A rate limiting extension for loopback4 applications (github.com)](https://github.com/sourcefuse/loopback4-ratelimiter)
* [sourcefuse/loopback4-notifications: An extension for setting up various notification mechanisms in loopback4 application, vis-a-vis, Push notification, SMS notification, Email notification (github.com)](https://github.com/sourcefuse/loopback4-notifications)
* [sourcefuse/loopback4-s3: A loopback4 extension for AWS S3 integration (github.com)](https://github.com/sourcefuse/loopback4-s3)
* [sourcefuse/loopback4-audit-log: A loopback-next extension for implementing audit logs in loopback applications for all DB transactions. (github.com)](https://github.com/sourcefuse/loopback4-audit-log)
* [sourcefuse/loopback4-soft-delete: A loopback4 extension for soft delete feature (github.com)](https://github.com/sourcefuse/loopback4-soft-delete)
* [sourcefuse/loopback4-authentication: A loopback-next extension for authentication feature. Oauth strategies supported. (github.com)](https://github.com/sourcefuse/loopback4-authentication)
* [sourcefuse/loopback4-authorization: An authorization extension for loopback4 applications (github.com)](https://github.com/sourcefuse/loopback4-authorization)
* [sourcefuse/loopback4-helmet: A loopback4 extension for helmetjs integration (github.com)](https://github.com/sourcefuse/loopback4-helmet)
* [sourcefuse/loopback4-vault: A loopback-next extension for HashiCorp's Vault integration in loopback-next applications (github.com)](https://github.com/sourcefuse/loopback4-vault)
* 

### Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker]([Issues · sourcefuse/loopback4-microservice-catalog · GitHub](https://github.com/sourcefuse/loopback4-microservice-catalog/issues)) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)! All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can. If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

### Contributing

* [Development Guidelines](DEVELOPING)

### Code of Conduct

Code of conduct guidelines [here.](CODE_OF_CONDUCT)

### License

[MIT](LICENSE)


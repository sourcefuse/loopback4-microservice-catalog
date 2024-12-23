# @sourceloop/entity-archival

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/entity-archival)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/entity-archival)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/entity-archival/@loopback/core)

## Installation

Install ArchivalComponent using `npm`;

```sh
$ npm install @sourceloop/entity-archival
```

## Overview

`@sourceloop/entity-archival` package is a powerful LoopBack 4 extension designed to implement entity level archival for your loopback applications. With this extension you can archive entries of any model to an external system. Many times we dont wish to delete data but considering the latency it brings with it we can save that to an external system and use it at our convenience. For that we have a retrieval process that helps us to fetch that data from external system and use it.

Here we have a repository level mixin that overrides the `deleteAll()` method - this method first saves the data to the external system, maintain a entry in the mapping table and then permanently delete the data from the system.

For the retrieval process we have a service class that can be invoked asynchronously to process it in background and return the data.

## Usage

In order to use entity archival into your application follow below steps.

- Configure and load ArchivalComponent in the application constructor
  as shown below.

```ts
import {ArchivalComponent, ArchivalComponentOptions, DEFAULT_ARCHIVAL_OPTIONS} from 'archival';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: ArchivalComponentOptions = DEFAULT_ARCHIVAL_OPTIONS;
    this.configure(ArchivalComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    };
    this.component(ArchivalComponent);
    // ...
  }
```

- Add Datasource
  Using `lb4 datasource` command create your own datasource using your preferred connector. Here is an example of datasource using postgres connector. Notice the statement `static dataSourceName = ArchivalDbSourceName;`. Make sure you change the data source name as per this in order to ensure connection work from extension.

```ts
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

const config = {
  name: 'audit',
  connector: 'postgresql',
  url: '',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
};

@lifeCycleObserver('datasource')
export class AuditDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuditDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.audit', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

- This extension already has the required models and repositories.

- The component exposes a mixin for your repository classes. Just extend your repository class with `ArchivalRepositoryMixin`, for all those repositories where you need to archive data. See an example below. For a model `Product`, here we are extending the `ProductRepository` with `ArchivalRepositoryMixin`.

```ts
import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AbstractConstructor,
  ArchivalRepositoryMixin,
} from '@sourceloop/archival';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DbDataSource} from '../datasources';
import {Product} from '../models';
export class ProductRepository extends ArchivalRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  {},
  AbstractConstructor<
    DefaultUserModifyCrudRepository<Product, typeof Product.prototype.id, {}>
  >
>(DefaultUserModifyCrudRepository, {}) {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('ProductRepository')
    public getRepository: Getter<ProductRepository>,
  ) {
    super(Product, dataSource, getCurrentUser);
  }
}
```

Make sure you provide `getCurrentUser` and `getRepository` Getter functions in constructor. When you invoke the `deleteAll()` method of the repository it will call the one defined in the mixin.

- Option to disable archival on specific functions by just passing `skipArchive: true` flag with options

```ts
deleteAll(data, {skipArchive: true});
```

- The Actor field is configurable and can save any string type value in the field.
  Though the default value will be userId a developer can save any string field from the current User that is being passed.

```ts
export interface User<ID = string, TID = string, UTID = string> {
  id?: string;
  username: string;
  password?: string;
  identifier?: ID;
  permissions: string[];
  authClientId: number;
  email?: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  tenantId?: TID;
  userTenantId?: UTID;
  passwordExpiryTime?: Date;
  allowedResources?: string[];
}
```

### Steps

1. All you need to do is bind a User key to the ActorIdKey in application.ts

```ts
this.bind(AuthServiceBindings.ActorIdKey).to('username');
```

2. Pass the actorIdKey argument in the constructor

```ts
@inject(AuditBindings.ActorIdKey, {optional: true})
public actorIdKey?: ActorId,
```

<!-- - To implement the importing of entries from external system

  - Create a job and return its Id to the user
  - Call the import function of the ImportArchivedDataService and pass the jobId to it.
    This function asynchronously fetch the data from external system and returns the json data. -->

## Providers and Services

- This package provides implementation to archive data to S3 buckets and 2 providers to export and import are available, to use that you can bind the following in your application.ts file and install following dependencies

```ts
npm install aws-sdk csv-parser stream
```

```ts
import {
  ExportArchiveDataProvider,
  ImportArchiveDataProvider,
} from '@sourceloop/entity-archival/aws-s3';

this.bind(ArchivalComponentBindings.EXPORT_ARCHIVE_DATA).toProvider(
  ExportArchiveDataProvider,
);
this.bind(ArchivalComponentBindings.IMPORT_ARCHIVE_DATA).toProvider(
  ImportArchiveDataProvider,
);
```

- ImportArchivedDataService uses a ProcessRetrievedDataProvider that takes the json data as input. You can implement it for data processing and save the retrieved data to desired system.

- BuildWhereConditionService is to save the filter column of archive_mapping model.

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Code of conduct

Code of conduct guidelines [here](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/.github/CODE_OF_CONDUCT.md).

## License

[MIT](https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/LICENSE)

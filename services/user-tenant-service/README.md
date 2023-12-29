# user-tenant-service

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Installation

Install UserTenantServiceComponent using `npm`;

```sh
$ [npm install | yarn add] user-tenant-service
```

## Basic Use

Configure and load UserTenantServiceComponent in the application constructor
as shown below.

```ts
import {UserTenantServiceComponent, UserTenantServiceComponentOptions, DEFAULT_USER_SERVICE_OPTIONS} from 'user-tenant-service';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: UserTenantServiceComponentOptions = DEFAULT_USER_SERVICE_OPTIONS;
    this.configure(UserTenantServiceComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(UserTenantServiceComponent);
    // ...
  }
  // ...
}
```

### Using with Sequelize

This service supports Sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension. And in order to use it, you'll need to do following changes.

1.To use Sequelize in your application, add following to application.ts:

```ts
this.bind(UserTenantServiceComponentBindings.Config).to({
  useCustomSequence: false,
  useSequelize: true,
});
```

2. Use the `SequelizeDataSource` in your datasource as the parent class. Refer [this](https://www.npmjs.com/package/@loopback/sequelize#step-1-configure-datasource) for more.

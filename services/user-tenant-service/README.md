# user-service

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install UserTenantServiceComponent using `npm`;

```sh
$ [npm install | yarn add] user-service
```

## Basic Use

Configure and load UserTenantServiceComponent in the application constructor
as shown below.

```ts
import {UserTenantServiceComponent, UserTenantServiceComponentOptions, DEFAULT_USER_SERVICE_OPTIONS} from 'user-service';
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

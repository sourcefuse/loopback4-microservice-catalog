# import-service

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install ImportServiceComponent using `npm`;

```sh
$ [npm install | yarn add] import-service
```

## Basic Use

Configure and load ImportServiceComponent in the application constructor
as shown below.

```ts
import {ImportServiceComponent, ImportServiceComponentOptions, DEFAULT_IMPORT_SERVICE_OPTIONS} from 'import-service';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: ImportServiceComponentOptions = DEFAULT_IMPORT_SERVICE_OPTIONS;
    this.configure(ImportServiceComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(ImportServiceComponent);
    // ...
  }
  // ...
}
```

# bpmn-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install BpmnServiceComponent using `npm`;

```sh
$ npm install bpmn-service
```

## Basic Use

Configure and load BpmnServiceComponent in the application constructor
as shown below.

```ts
import {BpmnServiceComponent, BpmnServiceComponentOptions, DEFAULT_BPMN_SERVICE_OPTIONS} from 'bpmn-service';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: BpmnServiceComponentOptions = DEFAULT_BPMN_SERVICE_OPTIONS;
    this.configure(BpmnServiceComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(BpmnServiceComponent);
    // ...
  }
  // ...
}
```

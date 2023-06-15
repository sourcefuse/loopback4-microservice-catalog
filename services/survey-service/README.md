# @sourceloop/survey-service

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install SurveyServiceComponent using `npm`;

```sh
$ [npm install | yarn add] @sourceloop/survey-service
```

## Basic Use

Configure and load SurveyServiceComponent in the application constructor
as shown below.

```ts
import {SurveyServiceComponent, SurveyServiceComponentOptions, DEFAULT__SOURCELOOP_SURVEY_SERVICE_OPTIONS} from '@sourceloop/survey-service';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: SurveyServiceComponentOptions = DEFAULT__SOURCELOOP_SURVEY_SERVICE_OPTIONS;
    this.configure(SurveyServiceComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(SurveyServiceComponent);
    // ...
  }
  // ...
}
```

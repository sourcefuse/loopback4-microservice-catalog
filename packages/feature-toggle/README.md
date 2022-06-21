# @sourceloop/feature-toggle

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/feature-toggle)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/feature-toggle-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/feature-toggle-service/@loopback/core)

A simple loopback-next extension for checking the disabled features. Here a new decorator is introduced it has a simplistic approach to check if a particular feature is allowed or not to that user.

## Working and Flow

This extension provides a method level decorator @featureFlag that takes the name of the feature that needs to be checked as metadata and verifies if that particular feature is allowed or not. It accepts a list of all the disabled features for a particular user as a part of current user of the type - `IAuthUserWithDisabledFeat`.

```ts
 @featureFlag({featureKey: 'feature_key'})
```

If you want to skip the check:

```ts
@featureFlag({featureKey: '*'})
```

A good practice is to keep all feature strings in a separate enum file like this.

```ts
export enum FEATUREKEY {
  CALENDAR = '1',
  CHAT = '2',
  CONTRACT = '3',
}
```

## Install

```sh
npm install @sourceloop/feature-toggle
```

## Basic Use

### Setup

- Create a new Loopback4 Application (If you don't have one already) lb4 testapp
- Install the service - npm i @sourceloop/feature-toggle
- Add the `FeatureToggleServiceComponent` to your Loopback4 Application (in `application.ts`).

```ts
// import the FeatureToggleServiceComponent
import {FeatureToggleServiceComponent} from '@sourceloop/feature-toggle-service';

// add Component for FeatureToggleService
this.component(FeatureToggleServiceComponent);
```

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-microservice-catalog/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

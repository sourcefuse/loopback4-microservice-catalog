# @sourceloop/feature-toggle

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

A simple loopback-next extension for checking the disabled features. Here a new decorator is introduced it has a simplistic approach to check if a particular feature is allowed or not to that user.

## Working and Flow

This extension provides a method level decorator `@featureFlag` that takes the name of the feature that needs to be checked as metadata and verifies if that particular feature is allowed or not. What it expects is that a list of disabled features is saved for the current user of the type `IAuthUserWithDisabledFeat` and compares that with the one passed in the metadata of the decorator.

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

In order to use this component into your application follow the easy steps given below.

- While authentication save the list of disabled features for that particular user. Like this

```ts
authUser.disabledFeatures = ['1', '3'];
```

- Add the `FeatureToggleComponent` to your Loopback4 Application (in `application.ts`) where you need to check the features availability.

```ts
// import the FeatureToggleComponent
import {FeatureToggleComponent} from '@sourceloop/feature-toggle';

// add Component for FeatureToggle
this.component(FeatureToggleComponent);
```

- Then add the decorator over all the APIs where feature needs to be checked. As shown above.

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

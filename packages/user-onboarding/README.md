# user-onboarding-client

## Overview

Microservice for providing a smooth user onboarding experience with the help of step by step application specific tours.

## Installation

```bash
npm install @sourceloop/user-onboarding-client
```

## Implementation

Create a new Application using Angular CLI and install @sourceloop/user-onboarding-client package. Make sure you fulfil all the peer dependencies ( you can check the package.json file in user-onboarding-lib folder for the same).

Once installed, you can create your custom tour service to trigger tours. In this service you will have to inject the two services provided by user-onboarding (TourService and TourStoreService)

- TourStoreService provides functions which help in managing the stored tour and state for a user. Description for some functions is as follows:

  - setSessionIdGenerator : Accepts a function which returns the session Id for a user.
  - getSessionId: returns the session Id for a user.
  - registerFnRef: to register a function corresponding to a key.
  - saveState/ loadState/ deleteState: are funtions which manage user state. The functions use commands, these commands can be overriden by registering your custom commands using the registerLoadStateCommand/ registerDeleteStateCommand/ registerSaveStateCommand functions. By default state is stored in localStorage.
  - saveTour/ loadTour/ deleteTour: are functions which manage tour steps. The functions use commands, these commands can be overriden by registering your custom commands using the registerLoadTourCommand/ registerDeleteTourCommand/ registerSaveTourCommand function. By default tour is stored in localStorage.
  - getFnByKey: returns the function corresponding to a key.

  Example for registering your own commands :

  ```
  registerCommands() {
    this.tourStoreService.registerSaveStateCommand(
      new SourceloopPostTourStateCommand(
        this.apiService,
        this.tourStateAdapter,
      ),
    );
    this.tourStoreService.setSessionIdGenerator(() => this.userTenantId);
  }

  export class SourceloopPostTourStateCommand<T, R> extends PostAPICommand<T, R> {
    constructor(apiService: ApiService, adapter: IAdapter<T, R>) {
      super(apiService, adapter, `${environment.userApiUrl}/user-tenant-prefs`);
    }
    execute() {
      this.parameters.data = Object.assign({}, this.parameters) as unknown as T;
      return super.execute();
    }
  }

  ```

- TourService basically is for triggering tours. The only function available here is the run function. It accepts the following paramters:

  - tourId : The id of the tour for which you want to run the tour
  - params (optional): The tour steps can be changed dynamically at run time, params is of type {[key: string]: string}, whatever is passed in params will be replaced with its corresponding value in tourSteps if present.
  - props (optional): Contains any additonal properties which you want to save as part of state
  - filterFn (optional): You can pass a function here which will be invoked before the tour begins. This function gets tourSteps as an arguments and can be used to filter steps on the basis of any condition.

  There are some observables that can be subsribed to:

  - tourComplete$ : emits when tour gets completed
  - tourStepChange$ : emits whenever step gets changed. Emits tourId, current step, prev step and direction.
  - tourFailed$ : emits value when tour fails.

  You can also set the maxWaitTime - this is the maximum time it will try to find the next/prev step, if not found it will throw error ( if selectors are correct then this condition will only happen in case of slow internet)

Next step is to create an array of TourSteps using the TourStep interface provided.
These Steps will be added in the tour. If you have not provided your own command, you can simply store these steps in localStorage. The TourStep Interface is as follows:

```
export interface TourStep {
  id: string;
  nextStepId: string;
  prevStepId: string;
  title?: string;
  text: string;
  arrow?: boolean;
  attachTo?: {
    element: string | Element;
    on: string;
    type: 'string' | 'function' | 'element';
    scrollTo: boolean;
  };
  classes?: string;
  advanceOn?: {
    element: string | Element;
    event: string;
    elementType: 'string' | 'function' | 'element';
  };
  buttons?: TourButton[];
  currentRoute?: string;
  nextRoute?: string;
  prevRoute?: string;
  cancelIcon?: {
    enabled?: boolean;
    label?: string;
  };
  modalOverlayOpeningRadius?: number;
  modalOverlayOpeningPadding?: number;
  popperOptions?: object;
}
```

Description for various things is as follows:

- **id**: The unique id for the step
- **nextStepId**: The id for the next step
- **prevStepId**: The id for the previous step
- **title**: The title you want to display in the popup
- **text**: The actual text that will appear in the popup, videos/img can be added here. For videos you can use the prefix and suffix constants provided:

  ```
  import { prefix,suffix} from '@sourceloop/user-onboarding-client';
  const URL = "http://192.168.69.191:8887/video.webm";

  sampleTour : TourStep[] = [{
    title: 'Step 1',
    id: 'example-step-1',
    prevStepId: 'example-step-1',
    nextStepId: 'example-step-2',
    text: `${prefix} ${this.URL} ${suffix}`,

    //other config values

  }]
  ```

- **arrow** :Whether to display the arrow for the tooltip or not. Defaults to true.
- **attachTo** : to specify where the element should be attached. If omitted the popup will get displayed on center of screen. In the attachTo object the 'on' property defines where the step will be attached on the element (Possible string values: 'auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end')
- **classes**: A string of extra classes to add to the step's content element.
- **advanceOn**: An action on the page which should advance shepherd to the next step. It should be an object with a string selector and an event name.
- **buttons**: An array of buttons to add to the step. These will be rendered in a footer below the main body text. The button has a property key. This key refers to the key on which any function was registered. Whenever the user clicks this button the function registered which this key will be invoked. This function will be bound to the context {tour: this.tour, tourId, props}. For next and prev button you don't need to register any function, you can simple put key 'nextAction' and 'prevAction' respectively.
- **currentRoute/nextRoute/prevRoute**: to enable multipage tour functionality provide the previous step url in prevRoute and next step url in nextRoute. If the nextStep is on the same page then make nextRoute = currentRoute. Similarily if the previous step was on the same page as the current step make prevRoute = currentRoute. If all steps are on same page put '/' in all.
- **cancelIcon**: Options for cancel Icon. Enable/disable a cross in top right of header.
- **modalOverlayOpeningRadius**: An amount of border radius to add around the modal overlay opening.
- **modalOverlayOpeningPadding**: An amount of padding to add around the modal overlay opening
- **popperOptions**: Extra options to pass to Popper.
  You can refer https://shepherdjs.dev/docs/Step.html for more details.
  An example for TourStep array is as follows:

```typescript
export const TOUR_STEPS: TourStep[] = [
  {
    title: '',
    id: 'step1',
    prevStepId: 'step1',
    nextStepId: 'step2',
    text: `
    <div class="tour-step">Step 1 of 3</div>
    <div class="tour-title">Step 1</div>
    <div class="tour-description">
    Sample Example for tour steps
    </div>`,
    buttons: [
      {
        text: 'Skip',
        key: 'skipAction',
        classes: 'shepherd-button-skip',
      },
      {
        text: 'Next',
        key: 'nextAction',
        classes: 'shepherd-button-next',
      },
    ],
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: {
      enabled: false,
    },
    modalOverlayOpeningRadius: 4,
    arrow: false,
    popperOptions: {
      modifiers: [{name: 'offset', options: {offset: [0, 4]}}],
    },
  },
  {
    title: '',
    id: 'step2',
    prevStepId: 'step1',
    nextStepId: 'step3',
    text: `
    <div class="tour-step">Step 2 of 3</div>
    <div class="tour-title">Step 2</div>
    <div class="tour-description">
    Sample Example for tour steps
    </div>`,
    attachTo: {
      element: '.example-tour-step2',
      on: 'bottom',
      type: 'string',
      scrollTo: true,
    },
    buttons: [
      {
        text: 'Previous',
        key: 'prevAction',
        classes: 'shepherd-button-prev',
      },
      {
        text: 'Skip',
        key: 'skipAction',
        classes: 'shepherd-button-skip',
      },
      {
        text: 'Next',
        key: 'nextAction',
        classes: 'shepherd-button-next',
      },
    ],
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: {
      enabled: false,
    },
    modalOverlayOpeningRadius: 4,
    arrow: false,
    popperOptions: {
      modifiers: [{name: 'offset', options: {offset: [0, 4]}}],
    },
  },

  {
    title: '',
    id: 'step3',
    prevStepId: 'step2',
    nextStepId: '',
    text: `
      <img class="tour-images" src="assets/sourceloop-tour/some-imgage.gif" alt="no image">
      <div class="tour-step">Step 3 of 3</div>
      <div class="tour-title">Step 3</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    attachTo: {
      element: '.example-tour-step3',
      on: 'right',
      type: 'string',
      scrollTo: true,
    },
    buttons: [
      {
        text: 'Previous',
        key: 'prevAction',
        classes: 'shepherd-button-prev shepherd-button-prev-no-skip',
      },
      {
        text: 'Done',
        key: 'nextAction',
        classes: 'shepherd-button-next',
      },
    ],
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: {
      enabled: false,
    },
    modalOverlayOpeningRadius: 4,
    arrow: false,
    popperOptions: {
      modifiers: [{name: 'offset', options: {offset: [0, 4]}}],
    },
  },
];
```

Once you have made your steps then u can save these in local Storage if using default comands as follows :

```
  this.localStorage.set(tourId, {
    tourSteps,
    tourId,
  });

```

Once you have registed everything according to your requirements, you simply need to run the tour using its tourId using the TourService. A very basic example is provided below:

```
@Injectable()
export class SourceloopUserOnboardingTourService implements OnDestroy {

  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly tourService: TourServiceService,
    private readonly apiService: ApiService,
    private readonly tourStateAdapter: TourStateAdapter,
  ) {
    this.registerCommands();
    this.tourService.tourFailed$.subscribe(err => {
        console.log('Error', err)
        //reload page or mark tour complete
    }),
    this.tourService.tourComplete$.subscribe(event => {
       console.log(err)
       // perform any action which is needed after tour completion
    })
  }

  // call this function from other components
  runTour(tourId: TourId) {
    this.tourService.run(tourId);
  }

  registerCommands() {
    this.tourService.maxWaitTime = MAX_WAIT_TIME;
    this.tourStoreService.registerSaveStateCommand(
      new SourceloopPostTourStateCommand(
        this.apiService,
        this.tourStateAdapter,
      ),
    );
    this.tourStoreService.registerLoadStateCommand(
      new SourceloopGetTourStateCommand(this.apiService, this.tourStateAdapter),
    );
  }
}
```

We can also alter the styles of the tour. For this we have provided the mixins to the user. We can use any of the mixins shown below.
Here,

- **sourceloopElement** mixin exposes background color, border radius and maximum width style of the tour.
- **sourceloopButton** mixin exposes background color, border radius of button and color of the text of the button style of the button.
- **sourceloopTitle** mixin exposes title text color, font size and font weight style of the title text.
- **sourceloopCancelIcon** mixin exposes background color of the cancel icon, border radius of the cancel icon and color of cancel icon style of the cancel icon.
- **sourceloopText** mixin exposes text color and font size of the tour text

```css
@import '../../node_modules/@sourceloop/user-onboarding-client/assets/default.scss';
.shepherd-element {
  @include sourceloopElement(black, 5px, 500px);
}

.shepherd-button {
  @include sourceloopButton(blue, 5px, white);
}

.shepherd-title {
  @include sourceloopTitle(blue, 2rem, 500);
}

.shepherd-cancel-icon {
  @include sourceloopCancelIcon(black, solid, white);
}
.shepherd-text {
  @include sourceloopText(black, 1rem);
}
```

You can provide your own classes to buttons/text and then give your own styling if you do not wish to use mixins. However, you will have to import default.scss in any case.

```css
@import '../../node_modules/@sourceloop/user-onboarding-client/assets/default.scss';
@include sourceloopBtnClr1(white, 5px, black);
```

There are also two themes available for use i.e. the light theme and the dark theme which can be used for some default theming. You can use these themes like shown below.

```typescript
@import "../../node_modules/@sourceloop/user-onboarding-client/assets/default.scss";
@include sourceloopTheme('light');
```

```typescript
@import "../../node_modules/@sourceloop/user-onboarding-client/assets/default.scss";
@include sourceloopTheme('dark');
```

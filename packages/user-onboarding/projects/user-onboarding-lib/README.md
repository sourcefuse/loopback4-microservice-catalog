# user-onboarding-client


## Overview

Microservice for providing a smooth user onboarding experience with the help of step by step application specific tours.


### Installation

First step is to clone the user-onboarding folder inside the packages folder.
Then navigate inside the user-onboarding folder and run
```bash
ng build
```
This will create a dist folder
then navigate inside the dist folder and then to user-onboarding-lib and run

```bash
npm pack
```
This will create a Tar Package which can be installed by running the npm install command and instead of package name give
npm install path-of-tar/name-of-tar.tgz

## Implementation

Create a new Application using Angular Cli and import the @sourceloop/user-onboarding-client and ngx-webstorage-service in "app.component.ts"

```typescript
    import {TourServiceService, TourStoreServiceService} from '@sourceloop/user-onboarding-client';
    import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";
```


Two Services are provided (TourService and TourStoreService)

TourStoreService provides with the functions - :

 A function to a session ID used to log the user session with the tour created.
 ```typescript
    sessionID = this.tourStoreService.getSessionId();
 ```
 Functions to register the created custom commands and different interfaces for the implementation.
 ```typescript
import { Observable, of } from 'rxjs';
import {
  LoadStateCommand,
  SaveStateCommand,
  LoadStateParameters,
  SaveStateParameters,
  TourState,
  SaveTourCommand,
  LoadTourCommand,
  SaveTourParameters,
  LoadTourParameters,
  Tour,
} from '@sourceloop/user-onboarding-client';
import { StorageService } from 'ngx-webstorage-service';

export class SaveTCommandCustom implements SaveTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: SaveTourParameters;
  execute(): Observable<Tour> {
    const newTour: Tour = {
      tourId: this.parameters.tourId,
      tourSteps: this.parameters.tourSteps,
      styleSheet: this.parameters.styleSheet,
    };
    this.storage.set(this.parameters.tourId, newTour);
    return of(newTour);
  }
}

export class LoadTCommandCustom implements LoadTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: LoadTourParameters;
  execute(): Observable<Tour> {
    const existingTour = this.storage.get(this.parameters.tourId);
    return of(existingTour);
  }
}

export class SaveSCommandCustom implements SaveStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: SaveStateParameters;
  execute(): Observable<TourState> {
    const newTourState = this.parameters.state;
    this.storage.set(newTourState.sessionId, newTourState);
    return of(newTourState);
  }
}
export class LoadSCommandCustom implements LoadStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: LoadStateParameters;
  execute(): Observable<TourState> {
    const currentState = this.storage.get(this.parameters.sessionId);
    return of(currentState);
  }
}
 ```

 Next step is to create an array of TourSteps using the TourStep interface provided.
 These Steps will be added in the tour.

 to enable multipage tour functionality provide the previous step url in prevRoute and next step url in nextRoute.

 If the nextStep is on the same page then make currentRoute = nextRoute
 similarily for the if the previous step was on the same page as the current step make prevRoute = currentRoute

Note: this also works for the case if the whole tour is on the same page

 Also in the attachTo object the 'on' property defines where the step will be attached on the element (top,bottom,right,left) if the field is set to empty '' then the step will appear at the center of the page where the element is present. 

 ```typescript
 sampleTour: TourStep[] = [
    {
      title: 'Step 1',
      id: 'example-step-1',
      prevStepId: 'example-step-1',
      nextStepId: 'example-step-2',
      text: 'Text to display on the step',
      attachTo: {
        element: 'selector of the element to be attached to',
        on: 'bottom',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: ()=>{},
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: ()=>{},
        },
      ],
      currentRoute:"main/home",
      nextRoute: 'main/home',
      prevRoute: "main/home",
    },
    {
      title: 'Step 2',
      id: 'example-step-2',
      prevStepId: 'example-step-1',
      nextStepId: 'example-step-3',
      text: 'Text to display on the step',
      attachTo: {
        element: 'selector of the element to be attached to',
        on: 'right',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: ()=>{},
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: ()=>{},
        },
      ],
      currentRoute:"main/home",
      nextRoute: 'main/nextPage',
      prevRoute: "main/home",
    },
    {
      title: 'Step 3',
      id: 'example-step-3',
      prevStepId: 'example-step-2',
      nextStepId: 'example-step-4',
      text: 'Text to display on the step',
      attachTo: {
        element: 'selector of the element to be attached to',
        on: '',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: ()=>{},
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: ()=>{},
        },
      ],
      currentRoute:"main/nextPage",
      nextRoute: 'main/nextPage',
      prevRoute: "main/home",
    },
    {
      title: 'Step 4',
      id: 'example-step-4',
      prevStepId: 'example-step-3',
      nextStepId: 'example-step-5',
      text: 'Text to display on the step',
      attachTo: {
        element: 'selector of the element to be attached to',
        on: 'bottom',
        type: 'string',
      },
      buttons: [
        {
          text: 'Back',
          key: 'prevAction',
          action: ()=>{},
        },
        {
          text: 'Next',
          key: 'nextAction',
          action: ()=>{},
        },
      ],
      currentRoute:"main/nextPage",
      nextRoute: 'main/nextPage/nextPage-1',
      prevRoute: "main/nextPage",
    },
];


```
We can also add videos to our tour by importing prefix and suffix variables from the library and providing the URL of the video on the file server. An example is shown below

 ```typescript
 import { prefix,suffix} from '@sourceloop/user-onboarding-client';
 URL = "http://192.168.69.191:8887/video.webm";
 URL2 = "http://192.168.69.191:8887/file.mp4";
 sampleTour : TourStep[] = [{
    title: 'Step 1',
    id: 'example-step-1',
    prevStepId: 'example-step-1',
    nextStepId: 'example-step-2',
    text: `${prefix} ${this.URL} ${suffix}`,
    attachTo: {
      element: '.elem1',
      on: 'bottom',
      type: 'string'
    },
    buttons: [
      {
        text: 'Back',
        action: 'prevAction',
      },
      {
        text: 'Next',
        action: 'nextAction',
      }
    ]
    currentRoute:"main/home",
    nextRoute: 'main/home',
    prevRoute: "main/home",
  },
  {
    title: 'Step 2',
    id: 'example-step-2',
    prevStepId: 'example-step-1',
    nextStepId: 'example-step-3',
    text: `${prefix} ${this.URL2} ${suffix}`,
    attachTo: {
      element: '.elem2',
      on: 'bottom',
      type: 'string'
    },
    buttons: [
      {
        text: 'Back',
        action: 'prevAction',
      },
      {
        text: 'Next',
        action: 'nextAction',
      }
    ]
    currentRoute:"main/home",
    nextRoute: 'main/home',
    prevRoute: "main/home",
  }
];


```
 By default commands are also provided incase a user doesn't specify the custom commands to be used.

 After the commands have been registered, register the functions as well, that will be used for the tour actions eg. next, prev etc.

 Use of ReplaySubject is recommended.



 ```typescript
    let tourSubject = new ReplaySubject<Tour>();
    this.tourStoreService
      .loadTour({ tourId: this.tourID })
      .subscribe((existingTour) => {
        if (!existingTour) {
          this.tourStoreService
            .saveTour({
              tourId: this.tourID,
              tourSteps: this.sampleTour,
              styleSheet: '',
            })
            .subscribe((newTour) => {
              tourSubject.next(newTour);
            });
        } else {
          tourSubject.next(existingTour);
        }
      });

    tourSubject.subscribe((tour) => {
      this.tourStoreService.registerFnRef('nextAction', function () {
        this.cancel();
        this.next();
      });
    });
    tourSubject.subscribe((tour) => {
      this.tourStoreService.registerFnRef('prevAction', function () {
        this.cancel();
        this.back();
      });

      this.tourService.run(tour.tourId);
    }); 
 ```
 in the above code the TourService provides with the run function which starts the tour.

We can also alter the styles of the tour. For this we have provided the mixins to the user. We can use any of the mixins shown below.
Here sourceloopElement mixin exposes background color, border radius and maximum width style of the tour.
Here sourceloopButton mixin exposes background color, border radius of button and color of the text of the button style of the button.
Here sourceloopTitle mixin exposes title text color, font size and font weight style of the title text.
Here sourceloopCancelIcon mixin exposes background color of the cancel icon, border radius of the cancel icon and color of cancel icon style of the cancel icon.
Here sourceloopText mixin exposes text color and font size of the tour text
```css
@import "../../node_modules/@sourceloop/user-onboarding-client/src/assets/default.scss";
.shepherd-element
{
   @include sourceloopElement(black,5px,500px);
}

.shepherd-button
{
  @include sourceloopButton(blue,5px, white);
}

.shepherd-title
{
  @include sourceloopTitle(blue,2rem,500);
}

.shepherd-cancel-icon
{
  @include sourceloopCancelIcon(black,solid,white);
}
.shepherd-text
{
  @include sourceloopText(black,1rem);
}

```

Now if you want to have both the buttons of different attributes you can overwrite the attributes of one button using the mixin shown below. You have to also include the class selector shown below while defining the steps.
```css
@import "../../node_modules/@sourceloop/user-onboarding-client/src/assets/default.scss";
@include sourceloopBtnClr1(white,5px,black);
```

```typescript
sampleTour : TourStep[] = [{
    title: 'sampleStep 1',
    id: 'example-step-1',
    text: `${prefix} ${this.URL} ${suffix}`,
    attachTo: {
      element: '.elem1',
      on: 'bottom',
      type: 'string'
    },
    buttons: [
      {
        text: 'Back',
        action: 'prevAction',
        classes: 'sourceloop-btn-class1',
      },
      {
        text: 'Next',
        action: 'nextAction',
      }
    ]
  },
  {
    title: 'sampleStep 2',
    id: 'example-step-2',
    text: `${prefix} ${this.URL2} ${suffix}`,
    attachTo: {
      element: '.elem2',
      on: 'bottom',
      type: 'string'
    },
    buttons: [
      {
        text: 'Back',
        action: 'prevAction',
        classes: 'sourceloop-btn-class1',
      },
      {
        text: 'Next',
        action: 'nextAction',
      }
    ]
  }
];

```

There are also two themes available for use i.e. the light theme and the dark theme which can be used for some default theming. You can use these themes like shown below.
```typescript
@import "../../node_modules/@sourceloop/user-onboarding-client/src/assets/default.scss";
@include sourceloopTheme('light');
```
```typescript
@import "../../node_modules/@sourceloop/user-onboarding-client/src/assets/default.scss";
@include sourceloopTheme('dark');
```
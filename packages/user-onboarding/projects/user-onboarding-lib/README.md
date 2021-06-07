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

 ```typescript
 sampleTour : TourStep[] = [{
    title: 'sampleStep 1',
    id: 'example-step-1',
    text: 'This step is attached to the bottom of THE BAND element.',
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
  },
  {
    title: 'sampleStep 2',
    id: 'example-step-2',
    text: 'This step is attached to the bottom of contact element.',
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
  },
  {
    title: 'sampleStep 3',
    id: 'example-step-3',
    text: 'This step is attached to the bottom of TOUR DATES element.',
    attachTo: {
      element: '.elem3',
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
  },
  {
    title: 'sampleStep 4',
    id: 'example-step-4',
    text: 'This step is attached to the bottom of TICKET MODAL element.',
    attachTo: {
      element: '.elem4',
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
        this.next();
      });
    });
    tourSubject.subscribe((tour) => {
      this.tourStoreService.registerFnRef('prevAction', function () {
        this.back();
      });

      this.tourService.run(tour.tourId);
    }); 
 ```
 in the above code the TourService provides with the run function which starts the tour.

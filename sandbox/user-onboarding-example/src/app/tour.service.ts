// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Inject, Injectable} from '@angular/core';
import {
  Status,
  TourServiceService,
  TourStoreServiceService,
} from '@sourceloop/user-onboarding-client';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {BehaviorSubject} from 'rxjs';
import {DASHBOARD_TOUR_STEPS, DEVS_TOUR_STEPS, TourId} from './tour.constant';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  tourRunning$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(LOCAL_STORAGE) private readonly storage: StorageService,
    private readonly tourService: TourServiceService,
    private readonly tourStoreService: TourStoreServiceService,
  ) {
    this.setAllTours();
    this.registerSkipFunction();
    this.tourService.tourFailed$.subscribe(res => {
      this.resetAllTours();
      window.location.reload();
    });
    this.tourService.tourComplete$.subscribe(() => {
      this.tourRunning$.next(false);
    });
  }

  runTour(tourId: TourId) {
    const state = this.storage.get(
      `${this.tourStoreService.getSessionId()}_${tourId}`,
    );
    if (state === undefined || state.status === Status.InProgress) {
      this.tourService.run(tourId);
      this.tourRunning$.next(true);
    }
  }
  resetAllTours() {
    this.storage.remove(
      `${this.tourStoreService.getSessionId()}_${TourId.DashboardTour}`,
    );
    this.storage.remove(
      `${this.tourStoreService.getSessionId()}_${TourId.DevTour}`,
    );
  }
  setAllTours() {
    this.storage.set(TourId.DashboardTour, {
      tourId: TourId.DashboardTour,
      tourSteps: DASHBOARD_TOUR_STEPS,
    });
    this.storage.set(TourId.DevTour, {
      tourId: TourId.DevTour,
      tourSteps: DEVS_TOUR_STEPS,
    });
  }
  registerSkipFunction() {
    const {tourStoreService, tourRunning$} = this;
    this.tourStoreService.registerFnRef('skipAction', function () {
      this.tour.hide();
      tourStoreService
        .saveState({
          tourId: this.tourId,
          state: {
            sessionId: tourStoreService.getSessionId(),
            step: '',
            status: Status.Complete,
          },
        })
        .subscribe(() => {
          this.tour.cancel();
        });
      tourRunning$.next(false);
    });
  }
}

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {NgModule, Injector} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {TourServiceService} from './tour-service.service';
import {TourStoreServiceService} from './tour-store-service.service';

@NgModule({
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BrowserModule,
  ],
  bootstrap: [],
})
export class UserOnboardingElementModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const tourservice = this.injector.get(TourServiceService);
    const tourstoreservice = this.injector.get(TourStoreServiceService);

    // to export the service for vanilla JS projects
    Object.assign(window, {
      tourservice,
      tourstoreservice,
    });
  }
}

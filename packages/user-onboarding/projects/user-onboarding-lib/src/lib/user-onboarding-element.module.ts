import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { TourServiceService } from './tour-service.service';
import { TourStoreServiceService } from './tour-store-service.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BrowserModule,
    RouterModule
  ],
  bootstrap:[],
  providers:[
    TourServiceService,
    TourStoreServiceService
  ]
})
export class UserOnboardingElementModule { 
  constructor(private injector: Injector) {}
  ngDoBootstrap(){
  const tourservice = this.injector.get(TourServiceService);
  const tourstoreservice = this.injector.get(TourStoreServiceService);

  // to export the service for vanilla JS projects
  Object.assign(window, {
    tourservice,
    tourstoreservice,
  });
}
}


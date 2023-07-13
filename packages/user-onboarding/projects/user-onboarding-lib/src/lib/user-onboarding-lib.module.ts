// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { NgModule } from '@angular/core';

import { StorageServiceModule } from 'ngx-webstorage-service';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { Router, RouterModule } from '@angular/router';
import { TourServiceService } from './tour-service.service';
import { TourStoreServiceService } from './tour-store-service.service';

@NgModule({
  declarations: [

  ],
  imports: [
    StorageServiceModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    RouterModule
  ],
  providers:[
    TourServiceService,
    TourStoreServiceService
  ]
})
export class UserOnboardingLibModule { 
 
}

import { NgModule } from '@angular/core';
import { UserOnboardingLibComponent } from './user-onboarding-lib.component';
import { StorageServiceModule } from 'ngx-webstorage-service';


@NgModule({
  declarations: [
    UserOnboardingLibComponent
  ],
  imports: [
    StorageServiceModule
  ],
  exports: [
    UserOnboardingLibComponent
  ]
})
export class UserOnboardingLibModule { }

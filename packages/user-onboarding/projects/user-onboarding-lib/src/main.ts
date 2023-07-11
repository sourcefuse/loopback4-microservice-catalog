import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {UserOnboardingElementModule} from './lib/user-onboarding-element.module';

enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(UserOnboardingElementModule)
  .catch(err => console.error(err)); //NOSONAR

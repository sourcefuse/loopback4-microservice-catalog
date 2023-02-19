import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {SearchElementModule} from './lib/search-element.module';

enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(SearchElementModule)
  .catch(err => console.error(err));

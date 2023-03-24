// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {Injector, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {createCustomElement} from '@angular/elements';
import {SearchComponent} from './search/search.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Configuration} from './lib-configuration';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  bootstrap: [],
})
export class SearchElementModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const webComponent = createCustomElement(SearchComponent, {
      injector: this.injector,
    });
    customElements.define('sourceloop-search-element', webComponent);
    // to export the Configuration class for vanilla JS projects
    Object.assign(window, {
      SearchConfiguration: Configuration,
    });
  }
}

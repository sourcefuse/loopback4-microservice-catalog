// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SearchLibModule, SEARCH_SERVICE_TOKEN} from '@sourceloop/search-client';

import {AppComponent} from './app.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchService} from './search.service';
import {TokenInputComponent} from './token-input/token-input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, SearchBarComponent, TokenInputComponent],
  imports: [
    BrowserModule,
    SearchLibModule, //import SearchLibModule
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [{provide: SEARCH_SERVICE_TOKEN, useClass: SearchService}], //Add your service here
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserOnboardingLibModule } from 'user-onboarding-lib'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserOnboardingLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

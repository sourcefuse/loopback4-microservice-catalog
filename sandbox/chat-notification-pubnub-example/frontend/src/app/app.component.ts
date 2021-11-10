import { Component } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ PubNubAngular ]
})
export class AppComponent {
  // constructor(pubnub: PubNubAngular) {
  //   pubnub.init({
  //       publishKey: 'pub-c-64a4aaf2-20d5-481a-b4d5-15b06b441883',
  //       subscribeKey: 'sub-c-795ac30a-1d26-11ec-ad6d-3eee4c94e219'
  //   });
  // }
  pubnub: PubNubAngular;
  channel: string;
  constructor(pubnub: PubNubAngular) {
    this.channel = 'f78efd90-37d9-11ec-8d3d-0242ac130003';
    this.pubnub = pubnub;
    this.pubnub.init({
      publishKey: 'pub-c-64a4aaf2-20d5-481a-b4d5-15b06b441883',
      subscribeKey: 'sub-c-795ac30a-1d26-11ec-ad6d-3eee4c94e219'
    });
    this.pubnub.subscribe({
      channels: ['02d374a3-3d92-067b-6502-b513a7594087','ff1b8600-0e86-e4cf-44da-67c0e627ab20'],
      triggerEvents: ['message']
    });
  }
  title = 'demo';
}

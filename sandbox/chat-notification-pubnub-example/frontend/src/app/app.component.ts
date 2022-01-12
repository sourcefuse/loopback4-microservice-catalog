import {Component} from '@angular/core';
import {PubNubAngular} from 'pubnub-angular2';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PubNubAngular],
})
export class AppComponent {
  pubnub: PubNubAngular;
  constructor(pubnub: PubNubAngular) {
    this.pubnub = pubnub;
    this.pubnub.init({
      publishKey: environment.PUBLISH_KEY,
      subscribeKey: environment.SUBSCRIBE_KEY,
    });
    this.pubnub.subscribe({
      channels: [environment.CHAT_ROOM],
      triggerEvents: ['message'],
    });
  }
  title = 'CHAT UI';
}

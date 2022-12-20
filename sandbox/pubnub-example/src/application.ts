// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {NotificationServiceComponent} from '@sourceloop/notification-service';
import {NotificationBindings} from 'loopback4-notifications';
import {PubnubBindings, PubNubProvider} from 'loopback4-notifications/pubnub';

export {ApplicationConfig};

require('dotenv').config();

export class PubnubExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(NotificationServiceComponent);

    /*
      subscribeKey: String - key used for subscribing to a channel (mandatory)
      publishKey: String - key used for publishing messages to a channel (mandatory)
      ssl: Boolean - if true request will be over HTTPS (optional)
      logVerbosity: Boolean - log the HTTP request (optional)
      uuid: String - set a unique uuid to identify a user
       or a device that connects to pubnub (mandatory)
      apns2Env: String - the environment on which its running (optional)
      apns2BundleId:  String - the bundle id (optional)
    */

    this.bind(PubnubBindings.Config).to({
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      ssl: process.env.SSL,
      logVerbosity: process.env.LOG_VERBOSITY,
      uuid: process.env.UUID,
      apns2Env: process.env.APP_ENV,
      apns2BundleId: process.env.APP_BUNDLE_ID,
    });

    this.bind(NotificationBindings.PushProvider).toProvider(PubNubProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

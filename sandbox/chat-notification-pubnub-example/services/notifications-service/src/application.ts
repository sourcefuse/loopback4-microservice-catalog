// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {NotificationServiceComponent} from '@sourceloop/notification-service';
// dotenv
import * as dotenv from 'dotenv';
import {
  NotificationBindings,
  PubnubBindings,
  PubNubProvider,
  SESBindings,
  SNSBindings,
} from 'loopback4-notifications';
import path from 'path';
import {MySequence} from './sequence';

// dotenv
dotenv.config();

export {ApplicationConfig};

export class ChatAndNotifApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // add Component for AuthenticationService
    this.component(NotificationServiceComponent);

    this.bind(PubnubBindings.Config).to({
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      ssl: process.env.SSL,
      logVerbosity: process.env.LOG_VERBOSITY,
      uuid: process.env.UUID,
      apns2Env: process.env.APP_ENV,
      apns2BundleId: process.env.APP_BUNDLE_ID,
    });

    this.bind(SNSBindings.Config).to({});
    this.bind(SESBindings.Config).to({});
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

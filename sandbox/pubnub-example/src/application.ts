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
import {
  NotificationServiceComponent,
  NotifServiceBindings,
} from '@sourceloop/notification-service';
import {
  NotificationBindings,
  PubnubBindings,
  PubNubProvider,
  SESBindings,
  SNSBindings,
} from 'loopback4-notifications';

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

    this.bind(NotifServiceBindings.Config).to({
      useCustomEmailProvider: false,
      useCustomSMSProvider: false,
      useCustomPushProvider: true,
      useCustomSequence: false,
    });

    this.bind(PubnubBindings.Config).to({
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      ssl: true,
      logVerbosity: true,
      uuid: 'my-app',
      apns2Env: 'dev',
      apns2BundleId: 'com.app.myapp',
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

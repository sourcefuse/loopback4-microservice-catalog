import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  NotificationServiceComponent,
  NotifServiceBindings,
} from '@sourceloop/notification-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  NotificationBindings,
  SocketBindings,
  SocketIOProvider,
} from 'loopback4-notifications';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class NotificationSocketExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: false,
      includeProcessEnv: true,
    });
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

    this.bind(NotifServiceBindings.Config).to({
      useCustomEmailProvider: true,
      useCustomSMSProvider: true,
      useCustomPushProvider: true,
      useCustomSequence: true,
    });
    this.component(NotificationServiceComponent);

    this.bind(SocketBindings.Config).to({
      url: process.env.SOCKET_SERVER_URL || '',
      defaultPath: process.env.SOCKET_DEFAULT_PATH || '',
    });
    this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);

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

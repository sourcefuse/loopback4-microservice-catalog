import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {NotificationServiceComponent} from '@sourceloop/notification-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  NotificationBindings,
  SocketBindings,
  SocketIOProvider,
} from 'loopback4-notifications';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';

export {ApplicationConfig};

export class NotificationServiceApplication extends BootMixin(
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

    // Adding the component of Notification Service
    this.component(NotificationServiceComponent);
    this.component(AuthenticationServiceComponent);

    this.bind(SocketBindings.Config).to({
      url: `${process.env.SOCKETIO_SERVER_URL}`,
      defaultPath: '/',
      options: {
        key: '',
      },
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

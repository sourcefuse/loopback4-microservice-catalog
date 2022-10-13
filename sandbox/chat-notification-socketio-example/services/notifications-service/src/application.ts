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
import {
  NotificationServiceComponent,
  NotifServiceBindings,
} from '@sourceloop/notification-service';
// dotenv
import * as dotenv from 'dotenv';
import { NotificationBindings } from 'loopback4-notifications';
import {
  SocketIOProvider,
  SocketBindings,
} from 'loopback4-notifications/socketio';
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

    this.bind(NotifServiceBindings.Config).to({
      useCustomEmailProvider: true,
      useCustomSMSProvider: true,
      useCustomPushProvider: true,
      useCustomSequence: true,
    });
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.bind(NotificationBindings.SMSProvider).to({} as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.bind(NotificationBindings.EmailProvider).to({} as any);
    // sonarignore:end
    this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);

    this.bind(SocketBindings.Config).to({
      url: 'ws://localhost:3000',
      defaultPath: 'general-message',
      options: {},
    });

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

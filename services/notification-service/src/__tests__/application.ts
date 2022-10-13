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
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import * as path from 'path';
import {BearerTokenVerifyProvider} from './bearer-token-verifier.provider';
import {MySequence} from './sequence';
import {NotificationServiceComponent} from '../component';
import {NotificationDbDataSource} from './datasources/notification-db.datasource';
import {NotificationDbCacheDataSource} from './datasources/notification-cache.datasource';
import {NotificationBindings} from 'loopback4-notifications';
import {
  ChannelManagerMockProvider,
  PubNubMockProvider,
  SnsMockProvider,
} from './fixture';
import {NotifServiceBindings} from '../keys';

export {ApplicationConfig};

export class NotificationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(NotificationServiceComponent);
    // Add authentication component
    this.component(AuthenticationComponent);
    this.dataSource(NotificationDbDataSource);
    this.dataSource(NotificationDbCacheDataSource);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    // Add authorization component
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

    this.bind(NotificationBindings.NotificationProvider).toProvider(
      SnsMockProvider,
    );
    this.bind(NotificationBindings.PushProvider).toProvider(PubNubMockProvider);
    this.bind(NotifServiceBindings.ChannelManager).toProvider(
      ChannelManagerMockProvider,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js'],
        nested: true,
      },
    };
  }
}

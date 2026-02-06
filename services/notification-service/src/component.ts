// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  BooterBasePathMixin,
  CoreComponent,
  CoreControllerBooter,
  CoreModelBooter,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import { JwtKeysRepository as SequelizeJwtKeysRepository } from '@sourceloop/core/sequelize';
import { AuthenticationComponent } from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import { NotificationsComponent } from 'loopback4-notifications';
import { NotifServiceBindings } from './keys';
import { Notification, NotificationAccess, NotificationUser } from './models';
import {
  ChannelManagerProvider,
  NotificationFilterProvider,
  NotificationUserSettingsProvider,
} from './providers';
import { NotificationUserProvider } from './providers/notification-user.service';
import {
  NotificationAccessRepository,
  NotificationRepository,
  NotificationUserRepository,
  UserNotificationSettingsRepository,
} from './repositories';

import { Booter } from '@loopback/boot';
import {
  NotificationRepository as NotificationSequelizeRepository,
  NotificationUserRepository as NotificationUserSequelizeRepository,
  UserNotificationSettingsRepository as UserNotificationSettingsSequelizeRepository,
} from './repositories/sequelize';
import { ProcessNotificationService } from './services';
import { INotifServiceConfig } from './types';
export class NotificationServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(NotifServiceBindings.Config, {optional: true})
    private readonly notifConfig?: INotifServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Notification Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    // Mount notifications component
    this.application.component(NotificationsComponent);

    if (!this.notifConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

       this.booters = [
      BooterBasePathMixin(CoreModelBooter, __dirname, {
        interface: NotificationServiceComponent.name,
      }),
      BooterBasePathMixin(CoreControllerBooter, __dirname, {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
        interface: NotificationServiceComponent.name,
      }),
    ];

    if (this.notifConfig?.useSequelize) {
      this.repositories = [
        NotificationAccessRepository,
        NotificationSequelizeRepository,
        NotificationUserSequelizeRepository,
        UserNotificationSettingsSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        NotificationAccessRepository,
        NotificationRepository,
        NotificationUserRepository,
        UserNotificationSettingsRepository,
        JwtKeysRepository,
      ];
    }

    this.models = [Notification, NotificationUser, NotificationAccess];

    this.providers = {
      [NotifServiceBindings.ChannelManager.key]: ChannelManagerProvider,
      [NotifServiceBindings.NotificationUserManager.key]:
        NotificationUserProvider,
      [NotifServiceBindings.NotificationFilter.key]: NotificationFilterProvider,
      [NotifServiceBindings.NotificationSettingFilter.key]:
        NotificationUserSettingsProvider,
    };



    this.application
      .bind('services.ProcessNotificationService')
      .toClass(ProcessNotificationService);
  }

  providers?: ProviderMap = {};

  bindings?: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  booters?: Class<Booter>[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}

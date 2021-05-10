import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  NotificationBindings,
  NotificationsComponent,
  PubNubProvider,
  SesProvider,
  SnsProvider,
} from 'loopback4-notifications';
import {
  NotificationController,
  NotificationNotificationUserController,
  NotificationUserController,
  NotificationUserNotificationController,
  PubnubNotificationController,
} from './controllers';
import {NotifServiceBindings} from './keys';
import {Notification, NotificationAccess, NotificationUser} from './models';
import {ChannelManagerProvider} from './providers';
import {NotificationUserProvider} from './providers/notification-user.service';
import {
  NotificationAccessRepository,
  NotificationRepository,
  NotificationUserRepository,
} from './repositories';
import {INotifServiceConfig} from './types';

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
    if (!this.notifConfig?.useCustomEmailProvider) {
      this.bindings.push(
        Binding.bind(NotificationBindings.EmailProvider).toProvider(
          SesProvider,
        ),
      );
    }
    if (!this.notifConfig?.useCustomPushProvider) {
      this.bindings.push(
        Binding.bind(NotificationBindings.PushProvider).toProvider(
          PubNubProvider,
        ),
      );
    }
    if (!this.notifConfig?.useCustomSMSProvider) {
      this.bindings.push(
        Binding.bind(NotificationBindings.SMSProvider).toProvider(SnsProvider),
      );
    }

    if (!this.notifConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.repositories = [
      NotificationAccessRepository,
      NotificationRepository,
      NotificationUserRepository,
    ];

    this.models = [Notification, NotificationUser, NotificationAccess];

    this.providers = {
      [NotifServiceBindings.ChannelManager.key]: ChannelManagerProvider,
      [NotifServiceBindings.NotificationUserManager.key]:
        NotificationUserProvider,
    };

    this.controllers = [
      NotificationController,
      NotificationUserController,
      PubnubNotificationController,
      NotificationNotificationUserController,
      NotificationUserNotificationController,
    ];
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

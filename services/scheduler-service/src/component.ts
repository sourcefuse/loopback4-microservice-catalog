import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
  createServiceBinding,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  AttachmentRepository,
  AttendeeRepository,
  CalendarRepository,
  EventRepository,
  SettingsRepository,
  SubscriptionRepository,
  ThemeRepository,
  WorkingHourRepository,
} from './repositories';
import {
  Attachment,
  Attendee,
  Calendar,
  Settings,
  Subscription,
  Theme,
  WorkingHour,
  Event,
} from './models';
import {
  AttachmentController,
  AttendeeController,
  CalendarController,
  EventController,
  SettingsController,
  SubscriptionController,
  ThemeController,
  WorkingHourController,
} from './controllers';
import {ValidatorService} from './services';

export class SchedulerServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.bindings = [createServiceBinding(ValidatorService)];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.repositories = [
      AttachmentRepository,
      AttendeeRepository,
      CalendarRepository,
      EventRepository,
      SettingsRepository,
      SubscriptionRepository,
      ThemeRepository,
      WorkingHourRepository,
    ];

    this.models = [
      Attachment,
      Attendee,
      Calendar,
      Event,
      Settings,
      Subscription,
      Theme,
      WorkingHour,
    ];

    this.providers = {};

    this.controllers = [
      AttachmentController,
      AttendeeController,
      CalendarController,
      EventController,
      SettingsController,
      SubscriptionController,
      ThemeController,
      WorkingHourController,
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
   * @param bindings Binding array
   */
  setupSequence(bindings: Binding[]) {
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

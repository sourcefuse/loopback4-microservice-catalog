import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  createServiceBinding,
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
  IServiceConfig,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  AttachmentController,
  AttendeeController,
  CalendarController,
  CalendarEventController,
  EventController,
  SettingsController,
  SubscriptionController,
  ThemeController,
  WorkingHourController,
} from './controllers';
import {SchedulerBindings} from './keys';
import {
  Attachment,
  Attendee,
  Calendar,
  Event,
  Settings,
  Subscription,
  Theme,
  WorkingHour,
} from './models';
import {
  AttachmentRepository,
  AttendeeRepository,
  CalendarRepository,
  EventRepository,
  SettingsRepository,
  SubscriptionRepository,
  ThemeRepository,
  WorkingHourRepository,
  EventAttendeeViewRepository,
} from './repositories';
import {ValidatorService, CalendarEventService} from './services';
import {EventService} from './services/event.service';
import {CalendarService} from './services/calendar.service';

export class SchedulerServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SchedulerBindings.Config, {optional: true})
    private readonly schedulerConfig?: IServiceConfig,
  ) {
    this.bindings = [
      createServiceBinding(ValidatorService),
      createServiceBinding(CalendarEventService),
      createServiceBinding(EventService),
      createServiceBinding(CalendarService),
    ];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    if (!(this.schedulerConfig && this.schedulerConfig.useCustomSequence)) {
      // Mount default sequence if needed
      this.setupSequence(this.bindings);
    }

    this.repositories = [
      AttachmentRepository,
      AttendeeRepository,
      CalendarRepository,
      EventRepository,
      SettingsRepository,
      SubscriptionRepository,
      ThemeRepository,
      WorkingHourRepository,
      EventAttendeeViewRepository,
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
      CalendarEventController,
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

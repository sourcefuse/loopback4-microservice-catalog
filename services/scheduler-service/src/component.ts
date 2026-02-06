// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Booter} from '@loopback/boot';
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
  BooterBasePathMixin,
  CoreComponent,
  CoreControllerBooter,
  CoreModelBooter,
  IServiceConfig,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {CoreSchedulerBindings, SchedulerBindings} from './keys';
import {
  Attachment,
  Attendee,
  Calendar,
  ConditionalAuditLog,
  Event,
  Settings,
  Subscription,
  Theme,
  WorkingHour,
} from './models';
import {
  AttachmentRepository,
  AttendeeRepository,
  AuditLogRepository,
  CalendarRepository,
  EventAttendeeViewRepository,
  EventRepository,
  SettingsRepository,
  SubscriptionRepository,
  ThemeRepository,
  WorkingHourRepository,
} from './repositories';
import {
  AttachmentRepository as AttachmentSequelizeRepository,
  AttendeeRepository as AttendeeSequelizeRepository,
  AuditLogRepository as AuditLogSequelizeRepository,
  CalendarRepository as CalendarSequelizeRepository,
  EventAttendeeViewRepository as EventAttendeeViewSequelizeRepository,
  EventRepository as EventSequelizeRepository,
  SettingsRepository as SettingsSequelizeRepository,
  SubscriptionRepository as SubscriptionSequelizeRepository,
  ThemeRepository as ThemeSequelizeRepository,
  WorkingHourRepository as WorkingHourSequelizeRepository,
} from './repositories/sequelize';
import {CalendarEventService, ValidatorService} from './services';
import {CalendarService} from './services/calendar.service';
import {EventService} from './services/event.service';

export class SchedulerServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SchedulerBindings.Config, {optional: true})
    private readonly schedulerConfig?: IServiceConfig,
    @inject(CoreSchedulerBindings.Config, {optional: true})
    private readonly config?: IServiceConfig,
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

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Scheduler Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.schedulerConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence(this.bindings);
    }

    if (this.config?.useSequelize) {
      this.repositories = [
        AttachmentSequelizeRepository,
        AttendeeSequelizeRepository,
        CalendarSequelizeRepository,
        EventSequelizeRepository,
        SettingsSequelizeRepository,
        SubscriptionSequelizeRepository,
        ThemeSequelizeRepository,
        WorkingHourSequelizeRepository,
        EventAttendeeViewSequelizeRepository,
        AuditLogSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
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
        AuditLogRepository,
        JwtKeysRepository,
      ];
    }
    this.models = [
      Attachment,
      Attendee,
      Calendar,
      Event,
      Settings,
      Subscription,
      Theme,
      WorkingHour,
      ConditionalAuditLog,
    ];

    this.providers = {};
    this.booters = [
      BooterBasePathMixin(CoreModelBooter, __dirname, {
        interface: SchedulerServiceComponent.name,
      }),
      BooterBasePathMixin(CoreControllerBooter, __dirname, {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
        interface: SchedulerServiceComponent.name,
      }),
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
  booters?: Class<Booter>[];

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

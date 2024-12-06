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
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
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
import {VideoChatArchiveController} from './controllers/video-chat-archive.controller';
import {VideoChatSessionController} from './controllers/video-chat-session.controller';
import {
  MeetLinkGeneratorProvider,
  ServiceBindings,
  VideoChatBindings,
} from './keys';
import {AuditLog} from './models';
import {VideoChatSession} from './models/video-chat-session.model';
import {TwilioProvider} from './providers/twilio/twilio.provider';
import {TwilioService} from './providers/twilio/twilio.service';
import {VonageProvider} from './providers/vonage/vonage.provider';
import {VonageService} from './providers/vonage/vonage.service';
import {
  AuditLogRepository,
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from './repositories';
import {
  AuditLogRepository as AuditLogSequelizeRepository,
  VideoChatSessionRepository as SessionAttendeesSequelizeRepository,
  SessionAttendeesRepository as VideoChatSequelizeSessionRepository,
} from './repositories/sequelize';
import {
  ChatArchiveService,
  ChatSessionService,
  MeetingLinkIdGeneratorProvider,
} from './services';

export class VideoConfServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(VideoChatBindings.Config, {optional: true})
    private readonly videoChatConfig?: IServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Video Conferencing Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    this.bindings.push(
      Binding.bind(ServiceBindings.SessionChatService).toClass(
        ChatSessionService,
      ),
      Binding.bind(ServiceBindings.ArchiveChatService).toClass(
        ChatArchiveService,
      ),
    );

    this.application.service(VonageService);
    this.application.service(TwilioService);

    if (!this.videoChatConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence(this.bindings);
    }

    if (this.videoChatConfig?.useSequelize) {
      this.repositories = [
        AuditLogSequelizeRepository, // this is the new audit repository needed for `@sourceloop/audit-logs`.
        VideoChatSequelizeSessionRepository,
        SessionAttendeesSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        AuditLogRepository, // this is the new audit repository needed for `@sourceloop/audit-logs`.
        VideoChatSessionRepository,
        SessionAttendeesRepository,
        JwtKeysRepository,
      ];
    }
    this.models = [AuditLog, VideoChatSession];
    this.providers = {
      [VideoChatBindings.VideoChatProvider.key]: VonageProvider,
      [MeetLinkGeneratorProvider.key]: MeetingLinkIdGeneratorProvider,
      TwilioProvider,
    };

    this.controllers = [VideoChatArchiveController, VideoChatSessionController];
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

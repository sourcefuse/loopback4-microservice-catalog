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
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

import {VideoChatArchiveController} from './controllers/video-chat-archive.controller';
import {VideoChatSessionController} from './controllers/video-chat-session.controller';
import {VideoChatBindings} from './keys';
import {AuditLogs} from './models/audit-logs.model';
import {VideoChatSession} from './models/video-chat-session.model';
import {VonageProvider} from './providers/vonage/vonage.provider';
import {VonageService} from './providers/vonage/vonage.service';
import {SessionAttendeesRepository} from './repositories';
import {AuditLogsRepository} from './repositories/audit-logs.repository';
import {VideoChatSessionRepository} from './repositories/video-chat-session.repository';

export class VideoConfServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(VideoChatBindings.Config, {optional: true})
    private readonly videChatConfig?: IServiceConfig,
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
      Binding.bind(VideoChatBindings.VideoChatProvider).toProvider(
        VonageProvider,
      ),
    );

    this.application.service(VonageService);

    if (!this.videChatConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence(this.bindings);
    }

    this.repositories = [
      AuditLogsRepository,
      VideoChatSessionRepository,
      SessionAttendeesRepository,
    ];

    this.models = [AuditLogs, VideoChatSession];

    this.providers = {
      [VideoChatBindings.VideoChatProvider.key]: VonageProvider,
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
